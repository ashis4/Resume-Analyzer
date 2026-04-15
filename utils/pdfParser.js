const pdfParseLib = require('pdf-parse');
const pdfParse = pdfParseLib.default || pdfParseLib;

const extractTextFromPDF = async (buffer) => {
  try {
    const data = await pdfParse(buffer);

    if (!data.text || data.text.trim() === '') {
      throw new Error('Could not extract text from PDF. Make sure it is not a scanned image.');
    }

    return data.text.trim();
  } catch (error) {
    throw new Error(`PDF parsing failed: ${error.message}`);
  }
};

module.exports = extractTextFromPDF;
