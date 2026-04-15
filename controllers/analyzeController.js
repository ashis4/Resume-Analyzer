const { GoogleGenerativeAI } = require('@google/generative-ai');
const extractTextFromPDF = require('../utils/pdfParser');
const buildPrompt = require('../utils/aiPrompt');
const Analysis = require('../models/Analysis');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const analyzeResume = async (req, res) => {
  try {
    console.log('Step 1: Request received');
    console.log('File:', req.file ? req.file.originalname : 'NO FILE');
    console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? 'SET ✓' : 'MISSING ✗');

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a PDF file' });
    }

    const jobDescription = req.body.jobDescription || '';

    console.log('Step 2: Extracting text from PDF...');
    const resumeText = await extractTextFromPDF(req.file.buffer);
    console.log('Step 2 OK: Extracted', resumeText.length, 'characters');

    const prompt = buildPrompt(resumeText, jobDescription);
    console.log('Step 3: Calling Gemini API...');

   const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(prompt);
    const rawResponse = result.response.text();

    console.log('Step 3 OK: Got response from Gemini');
    console.log('RAW (first 300 chars):', rawResponse.substring(0, 300));

    const cleanResponse = rawResponse
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    let report;
    try {
      report = JSON.parse(cleanResponse);
      console.log('Step 4 OK: JSON parsed successfully');
    } catch (parseError) {
      console.error('Step 4 FAILED: Could not parse JSON:', parseError.message);
      return res.status(500).json({
        message: 'AI returned an invalid response. Please try again.',
      });
    }

    if (req.user) {
      await Analysis.create({
        userId: req.user._id,
        resumeText,
        jobDescription,
        report,
      });
    }

    console.log('SUCCESS: Sending report');
    res.status(200).json({ report });

  } catch (error) {
    console.error('========== ERROR ==========');
    console.error('Message:', error.message);
    if (error.response) {
      console.error('API Status:', error.response.status);
      console.error('API Data:', JSON.stringify(error.response.data));
    }
    console.error('===========================');

    res.status(500).json({
      message: 'Server error during analysis',
      error: error.message,
    });
  }
};

const getUserAnalyses = async (req, res) => {
  try {
    const analyses = await Analysis.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .select('-resumeText');

    res.status(200).json(analyses);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAnalysisById = async (req, res) => {
  try {
    const analysis = await Analysis.findById(req.params.id);

    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }

    if (analysis.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.status(200).json(analysis);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { analyzeResume, getUserAnalyses, getAnalysisById };
