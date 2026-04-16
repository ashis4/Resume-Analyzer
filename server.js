console.log("Analyzer JS Loaded");

let selectedFile = null;

// Handle file select
const handleFileSelect = (event) => {
  const file = event.target.files[0];
  if (file) setFile(file);
};

// Validate & set file
const setFile = (file) => {
  if (file.type !== 'application/pdf') {
    document.getElementById('analyzeError').textContent = 'Only PDF files are allowed.';
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    document.getElementById('analyzeError').textContent = 'File size must be under 5MB.';
    return;
  }

  selectedFile = file;

  document.getElementById('uploadArea').style.display = 'none';
  document.getElementById('fileSelected').style.display = 'flex';
  document.getElementById('fileName').textContent = file.name;
  document.getElementById('analyzeError').textContent = '';
};

// Remove file
const removeFile = () => {
  selectedFile = null;
  document.getElementById('uploadArea').style.display = 'block';
  document.getElementById('fileSelected').style.display = 'none';
  document.getElementById('resumeInput').value = '';
};

// Drag & drop
const uploadArea = document.getElementById('uploadArea');

uploadArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
  uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadArea.classList.remove('dragover');
  const file = e.dataTransfer.files[0];
  if (file) setFile(file);
});

// MAIN FUNCTION
const handleAnalyze = async () => {
  console.log("Function Started");
  console.log("API_BASE:", API_BASE);

  const errorEl = document.getElementById('analyzeError');
  errorEl.textContent = '';

  if (!selectedFile) {
    errorEl.textContent = 'Please upload a PDF resume first.';
    return;
  }

  const jobDescription = document.getElementById('jobDescription').value.trim();

  const formData = new FormData();
  formData.append('resume', selectedFile);
  formData.append('jobDescription', jobDescription);

  // UI changes
  document.getElementById('analyzeBtn').style.display = 'none';
  document.getElementById('loading').style.display = 'block';

  errorEl.textContent = "Processing... please wait (30–60 seconds)";

  try {
    const headers = {};
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;

    // ⏳ Timeout controller
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 120000); // 2 minutes

    const res = await fetch(`${API_BASE}/api/analyze`, {
      method: 'POST',
      headers,
      body: formData,
      signal: controller.signal
    });

    clearTimeout(timeout);

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Analysis failed");
    }

    // Save result
    localStorage.setItem('latestReport', JSON.stringify(data.report));

    // Redirect
    window.location.href = 'report.html';

  } catch (err) {
    console.error("ERROR:", err);

    if (err.name === 'AbortError') {
      errorEl.textContent = "Server is slow. Please try again.";
    } else {
      errorEl.textContent = "Something went wrong. Try again.";
    }

    document.getElementById('analyzeBtn').style.display = 'block';
    document.getElementById('loading').style.display = 'none';
  }
};
