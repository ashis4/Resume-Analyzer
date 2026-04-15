const buildPrompt = (resumeText, jobDescription) => {
  const jdSection = jobDescription
    ? `Job Description:\n${jobDescription}\n\n`
    : 'No job description provided.\n\n';

  return `You are an expert resume analyzer and career coach. Analyze the following resume and return a detailed report in valid JSON format only. Do not include any text outside the JSON.

${jdSection}Resume:
${resumeText}

Return this exact JSON structure:
{
  "overallScore": <number 0-100>,
  "atsScore": <number 0-100>,
  "sectionScores": {
    "workExperience": <number 0-100>,
    "skills": <number 0-100>,
    "projects": <number 0-100>,
    "summary": <number 0-100>,
    "education": <number 0-100>
  },
  "keywords": {
    "present": [<list of strong keywords found in resume>],
    "missing": [<list of important keywords missing from resume${jobDescription ? ' based on the job description' : ''}>]
  },
  "suggestions": [
    {
      "priority": <"high" | "medium" | "low">,
      "title": <short title of suggestion>,
      "description": <detailed explanation of what to improve and how>
    }
  ],
  "jdMatchScore": <number 0-100, how well resume matches the job description. If no JD provided return 0>
}

Scoring rules:
- overallScore: general quality of the resume
- atsScore: how well it will pass ATS systems (keywords, formatting, structure)
- sectionScores: score each section individually based on quality and depth
- keywords.present: skills and terms that are strong in the resume
- keywords.missing: important skills missing${jobDescription ? ' based on the job description' : ''}
- suggestions: give at least 4 suggestions ordered by priority
- jdMatchScore: how well the resume matches the job description provided

Return valid JSON only. No explanation. No markdown. No code blocks.`;
};

module.exports = buildPrompt;