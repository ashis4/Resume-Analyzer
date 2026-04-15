const express = require('express');
const router = express.Router();
const multer = require('multer');
const { analyzeResume, getUserAnalyses, getAnalysisById } = require('../controllers/analyzeController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  },
});

router.post('/', optionalAuth, upload.single('resume'), analyzeResume);
router.get('/history', protect, getUserAnalyses);
router.get('/:id', protect, getAnalysisById);

module.exports = router;