const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    resumeText: {
      type: String,
      required: true,
    },
    jobDescription: {
      type: String,
      default: '',
    },
    report: {
      overallScore: { type: Number },
      atsScore: { type: Number },
      sectionScores: {
        workExperience: { type: Number },
        skills: { type: Number },
        projects: { type: Number },
        summary: { type: Number },
        education: { type: Number },
      },
      keywords: {
        present: [String],
        missing: [String],
      },
      suggestions: [
        {
          priority: { type: String },
          title: { type: String },
          description: { type: String },
        },
      ],
      jdMatchScore: { type: Number },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Analysis', analysisSchema);