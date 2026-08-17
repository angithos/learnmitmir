# learnmitmir 🇩🇪

An AI-assisted German language learning application built to make learning German more personalized and effective.

The application combines vocabulary learning, grammar practice, AI-generated exercises, and spaced repetition to help learners focus on the areas they struggle with most.

## 🚀 Features

### 📚 Vocabulary Learning
- Add German vocabulary words to a personal vocabulary collection.
- Retrieve word information from a German dictionary API.
- Identify grammatical gender (`der`, `die`, `das`).
- Detect plural forms.
- Store definitions and parts of speech.
- Designed for personalized vocabulary-based training.

### 📝 Grammar Practice
- Practice German grammar through interactive exercises.
- Grammar exercises are organized by topics and subtopics.
- Supports different question types, including:
  - Multiple choice
  - Fill in the blank
  - Typing exercises
- Includes explanations to help learners understand their mistakes.

### 🤖 AI-Assisted Learning
- Uses the OpenAI API to generate German learning content.
- AI-generated exercises can target specific grammar topics.
- Designed to provide additional practice based on the learner's needs.

### 🔄 Spaced Repetition
- Uses an SM-2 based spaced-repetition system.
- Tracks:
  - Repetitions
  - Ease factor
  - Review interval
  - Next review date
- Questions can be presented again when they become due for review.

### 🔥 Firebase Integration
- Firebase Authentication for user accounts.
- Cloud Firestore for storing:
  - User vocabulary
  - Grammar questions
  - Learning progress
  - Spaced-repetition data

Each user's learning data is stored separately, allowing the application to provide personalized learning.

---

## 🛠️ Tech Stack

### Frontend
- React
- TypeScript
- JavaScript
- CSS

### Backend / Services
- Firebase Authentication
- Firebase Firestore
- OpenAI API
- Vercel Serverless Functions

### Learning / NLP
- Spaced Repetition (SM-2)
- AI-generated language exercises
- German NLP / dictionary data

---
💻 Running Locally

Clone the repository:

git clone https://github.com/angithos/learnmitmir.git

cd learnmitmir

Install dependencies:

npm install

Create your environment configuration and add the required Firebase/API credentials.

Then start the development server:

npm run dev
