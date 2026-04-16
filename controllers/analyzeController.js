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

    // ✅ Extract text
    console.log('Step 2: Extracting text from PDF...');
    const resumeText = await extractTextFromPDF(req.file.buffer);
    console.log('Step 2 OK:', resumeText.length, 'characters');

    const prompt = buildPrompt(resumeText, jobDescription);

    // ✅ Models
    const modelPrimary = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const modelFallback = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    let rawResponse;

    // 🔥 Try primary model
    try {
      console.log('Step 3: Trying primary model...');
      const result = await modelPrimary.generateContent(prompt);
      rawResponse = result.response.text();
      console.log('Primary model success');
    } catch (primaryError) {
      console.error('Primary model failed:', primaryError.message);

      // 🔁 Retry once
      try {
        console.log('Retrying primary model...');
        const retryResult = await modelPrimary.generateContent(prompt);
        rawResponse = retryResult.response.text();
        console.log('Retry success');
      } catch (retryError) {
        console.error('Retry failed:', retryError.message);

        // 🔄 Fallback model
        try {
          console.log('Switching to fallback model...');
          const fallbackResult = await modelFallback.generateContent(prompt);
          rawResponse = fallbackResult.response.text();
          console.log('Fallback success');
        } catch (fallbackError) {
          console.error('Fallback also failed:', fallbackError.message);

          return res.status(500).json({
            message: 'AI service is temporarily unavailable. Please try again.',
          });
        }
      }
    }

    console.log('RAW (first 300 chars):', rawResponse.substring(0, 300));

    // ✅ Clean response
    const cleanResponse = rawResponse
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    let report;

    // ✅ Safe JSON parsing
    try {
      report = JSON.parse(cleanResponse);
      console.log('Step 4: JSON parsed successfully');
    } catch (parseError) {
      console.error('JSON parse failed:', parseError.message);

      // 💡 Return raw instead of crashing
      report = {
        raw: cleanResponse,
        note: 'AI response was not valid JSON, showing raw output',
      };
    }

    // ✅ Save to DB (optional user)
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
    console.error('===========================');

    res.status(500).json({
      message: 'Server error during analysis',
      error: error.message,
    });
  }
};

// ✅ Get all analyses
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

// ✅ Get single analysis
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
