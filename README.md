# 🚀 AI Resume Analyzer – Backend

## 📌 Overview

The **AI Resume Analyzer Backend** is a RESTful API built using Node.js and Express that analyzes resumes using AI. It processes user-uploaded resumes, evaluates them against job requirements, and provides intelligent suggestions to improve ATS (Applicant Tracking System) compatibility.

This backend powers the full-stack AI Resume Analyzer application by handling resume parsing, AI-based analysis, and data storage.

---

## ⚙️ Tech Stack

* **Node.js** – Server-side runtime
* **Express.js** – Web framework
* **MongoDB** – Database for storing user data & analysis history
* **Gemini API** – AI-powered resume analysis
* **Multer** – File upload handling
* **JWT (optional)** – Authentication (if implemented)

---

## ✨ Features

* 📄 Upload and analyze resumes (PDF/DOC)
* 🤖 AI-based resume evaluation using Gemini
* 📊 ATS score generation
* 🧠 Smart suggestions for improvement
* 🔍 Skill extraction and keyword analysis
* 🗂️ (Optional) Resume history storage using MongoDB
* 🔐 (Optional) User authentication & authorization

---

## 🔗 API Endpoints

### ▶️ Upload & Analyze Resume

POST `/analyze`

* Upload resume file
* Returns analysis, score, and suggestions

---

### ▶️ (Optional) User Authentication

POST `/signup`
POST `/login`

---

### ▶️ (Optional) Get Resume History

GET `/history`

---

## 📁 Project Structure

```
resume-analyzer-backend/
│── routes/
│── controllers/
│── models/
│── middleware/
│── uploads/
│── config/
│── server.js
│── package.json
```

---

## ⚡ Getting Started

### 1️⃣ Clone the repository

```
git clone https://github.com/your-username/resume-analyzer-backend.git
cd resume-analyzer-backend
```

### 2️⃣ Install dependencies

```
npm install
```

### 3️⃣ Setup environment variables

Create a `.env` file in root directory:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_api_key
JWT_SECRET=your_secret_key
```

### 4️⃣ Run the server

```
npm start
```

Server will run on:

```
http://localhost:5000
```

---

## 🌐 Deployment

* Backend deployed on **Railway**

---

## 🔗 Live Demo

🌍 https://venerable-moonbeam-de69ce.netlify.app/

---

## 🔗 Related Links

* 💻 Frontend Repo: (Add your frontend GitHub link here)

---

## 📈 Future Improvements

* Job description matching
* Resume scoring breakdown
* PDF report generation
* AI-powered resume rewriting
* Dashboard with analytics

---

## 🤝 Contributing

Contributions are welcome! Feel free to fork this repo and submit a pull request.

---

## 📬 Contact

If you have any questions or feedback, feel free to connect with me on LinkedIn.

---

⭐ If you like this project, don’t forget to star the repo!
