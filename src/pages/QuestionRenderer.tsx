import { useEffect, useState } from "react";
import { Timestamp } from "firebase/firestore";

import { Question } from "../types/Question";
import { EvaluationResultType } from "../utils/evaluation";
import { evaluateArticle, evaluateTranslations } from "../utils/evaluation";
import { mapToRating } from "../utils/rating";
import { saveReviewProgress, sm2 } from "../utils/sm2";
import { MOCK_QUESTIONS } from "./mockdata";
import { useLocation, useNavigate } from "react-router";

interface AnswerResult {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  rating: "again" | "hard" | "good" | "easy";
}


export default function QuestionRenderer() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedTopic = location.state?.topic || "nominativ";

  const [questions] = useState<Question[]>(() => {
    if (location.state?.customQuestions) {
      return location.state.customQuestions;
    }
    return MOCK_QUESTIONS[selectedTopic] || MOCK_QUESTIONS["nominativ"];
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [results, setResults] = useState<AnswerResult[]>([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    setStartTime(Date.now());
  }, [currentIndex]);

  /* ==========================================
     SUBMIT HANDLER
     ========================================== */
  const handleSubmit = () => {
    const timeTaken = Date.now() - startTime;
    let result: EvaluationResultType;
    let finalUserAnswer = "";
  
    if (currentQuestion.type === "mcq") {
      if (!selectedOption) return;
      finalUserAnswer = selectedOption;
      result = evaluateArticle(selectedOption, currentQuestion.answer, timeTaken);
    } else {
      if (!userAnswer.trim()) return;
      finalUserAnswer = userAnswer;
      result = evaluateTranslations(userAnswer, currentQuestion.answer, timeTaken);
    }
  
    const rating = mapToRating(result);
    const updated = sm2({ interval: 0, easeFactor: 2.5, repetitions: 0 }, rating);
    console.log("SM2 UPDATE:", updated);
    //tweak here 
    const currentSM2State = (currentQuestion as any).sm2State || {
      interval: 0,
      easeFactor: 2.5,
      repetitions: 0,
    };
    //idk what this does
    saveReviewProgress(
      currentQuestion.id,
      currentQuestion.topic,
      rating,
      currentSM2State
    );

    setResults((prev) => [
      ...prev,
      {
        question: currentQuestion.prompt,
        userAnswer: finalUserAnswer,
        correctAnswer: currentQuestion.answer,
        isCorrect: result.isCorrect,
        rating,
      },
    ]);
  
    setSelectedOption(null);
    setUserAnswer("");
    setShowAnswer(false);
    setCurrentIndex((prev) => prev + 1);
  };

/* ==========================================
   QUIZ COMPLETE VIEW
   ========================================== */
   if (currentIndex >= questions.length) {
    return (
      <div className="quiz-wrapper summary-page">
        <div className="quiz-card">
          <div className="quiz-progress-bar">
            <div className="quiz-counter" style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
              Quiz Complete! 🎉
            </div>
          </div>
          
          <div className="quiz-results-list" style={{ marginTop: "20px" }}>
            {results.map((r, idx) => (
              <div key={idx} className="quiz-result-item" style={{ padding: "15px 0", borderBottom: "1px solid #eee" }}>
                <p className="quiz-prompt"><strong>Q:</strong> {r.question}</p>
                <p><strong>Your Answer:</strong> <span style={{ color: r.isCorrect ? "#2ecc71" : "#e74c3c" }}>{r.userAnswer}</span></p>
                <p><strong>Correct Answer:</strong> {r.correctAnswer}</p>
                <p><small>Rating: {r.rating}</small></p>
              </div>
            ))}
          </div>
  
          {/* Return Button added here */}
          <button 
            onClick={() => navigate("/dashboard")} 
            className="btn btn-primary"
            style={{ width: "100%", marginTop: "20px", padding: "12px", borderRadius: "5px", fontWeight: "bold" }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  /* ==========================================
     DYNAMIC SUBMISSION VALIDATION
     ========================================== */
  const isInputEmpty = currentQuestion.type === "mcq" ? !selectedOption : !userAnswer.trim();

  return (
    <div className="quiz-wrapper">
      <div className="quiz-card">
        
        {/* Progress Bar & Counters */}
        <div className="quiz-progress-bar">
          <div className="quiz-counter">
            Question {currentIndex + 1} / {questions.length}
          </div>
          <div className="quiz-total">
            {questions.length - currentIndex - 1} questions remaining
          </div>
        </div>

        {/* Question Prompt */}
        <div className="quiz-question-container">
          <p className="quiz-prompt">{currentQuestion.prompt}</p>
        </div>

        {/* =========================================
            USER INPUT SECTION (BEFORE CHECKING)
            ========================================= */}
        {!showAnswer && (
          <div className="quiz-input-section">
            
            {/* 1. TYPING LAYOUT */}
            {currentQuestion.type === "typing" && (
              <div className="quiz-input-container">
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Type your translation here..."
                  className="quiz-input"
                  autoFocus
                />
              </div>
            )}

            {/* 2. MCQ LAYOUT */}
            {currentQuestion.type === "mcq" && (
              <div className="options-section" style={{ marginBottom: "20px" }}>
                <div className="options-grid" style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                  {currentQuestion.options?.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setSelectedOption(opt)}
                      className={`option-btn ${selectedOption === opt ? "selected" : ""}`}
                      style={{
                        padding: "10px 20px",
                        background: selectedOption === opt ? "#3498db" : "#fff",
                        color: selectedOption === opt ? "#fff" : "#333",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                        cursor: "pointer"
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <button 
              onClick={() => setShowAnswer(true)} 
              className="quiz-show-answer-btn"
              disabled={isInputEmpty}
            >
              {isInputEmpty ? "Select or type your answer first" : "Check Answer"}
            </button>
          </div>
        )}

        {/* =========================================
            ANSWER REVEAL SECTION (AFTER CHECKING)
            ========================================= */}
        {showAnswer && (
          <div className="quiz-answer-section">
            {/* User's Choice */}
            <div className="quiz-your-answer" style={{ marginBottom: "15px" }}>
              <div className="quiz-answer-label" style={{ fontWeight: "bold", color: "#666" }}>Your Answer</div>
              <div className="quiz-user-answer" style={{ fontSize: "1.1rem" }}>
                {currentQuestion.type === "mcq" ? selectedOption : (userAnswer || "(No answer provided)")}
              </div>
            </div>

            {/* Target Solution */}
            <div className="quiz-correct-answer-container" style={{ marginBottom: "20px" }}>
              <div className="correct-answer-label" style={{ fontWeight: "bold", color: "#666" }}>Correct Answer</div>
              <div className="correct-answer-text" style={{ fontSize: "1.2rem", color: "#2ecc71", fontWeight: "600" }}>
                {currentQuestion.answer}
              </div>
              <div>Explanation:{}</div>
            </div>

            {/* Proceed Action */}
            <button onClick={handleSubmit} className="quiz-continue-btn" style={{ width: "100%", padding: "12px", background: "#2ecc71", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}>
              Continue
            </button>
          </div>
        )}

      </div>
    </div>
  );
}