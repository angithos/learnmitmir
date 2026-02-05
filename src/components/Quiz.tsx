import { useState } from "react";
import { Question } from "../types/Question";
import ResultsPage from "../pages/ResultsPage";

interface QuizProps {
  questions: Question[];
  onAnswer: (
    question: Question,
    rating: "again" | "hard" | "good" | "easy"
  ) => void;
}
interface AnswerResult {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  rating: "again" | "hard" | "good" | "easy";
}

export default function Quiz({ questions, onAnswer }: QuizProps) {
  const [index, setIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [answerArray, setAnswerArray] = useState<AnswerResult[]>([]);

  // No questions state
  if (questions.length === 0) {
    return (
      <div className="no-questions-container">
        <div className="no-questions-emoji">🎉</div>
        <h3 className="no-questions-title">No Questions Today!</h3>
        <p className="no-questions-message">
        Great job! You've completed all your scheduled reviews for today.
        Come back tomorrow for more practice.
      </p>
      </div>
    );
  }

  const question = questions[index];

  const handleRating = (rating: "again" | "hard" | "good" | "easy") => {

    const metaAnswer = question.answer.toLowerCase().trim();
    const userAnswerLower = userAnswer.toLowerCase().trim();

    setAnswerArray((prev) => [
      ...prev,
      {
        question: question.prompt,
        userAnswer: userAnswer,
        correctAnswer: question.answer,
        isCorrect: metaAnswer === userAnswerLower,
        rating: rating
      }
    ]);
    onAnswer(question, rating);
    // Reset state
    setUserAnswer("");
    setShowAnswer(false);
    setIndex((i) => i + 1);
    
  };

  // Quiz completion
  if (index >= questions.length) {
    return <ResultsPage answers={answerArray} />;
  }

  return (
    <div className="quiz-wrapper">
      <div className="quiz-card">
        {/* Progress bar */}
        <div className="quiz-progress-bar">
          <div className="quiz-counter">
            Question {index + 1} / {questions.length}
          </div>
          <div className="quiz-total">
            {questions.length - index - 1} questions remaining
          </div>
        </div>

        {/* Question prompt */}
        <div className="quiz-question-container">
          <p className="quiz-prompt">{question.prompt}</p>
        </div>

        {/* User input section */}
        {!showAnswer && (
          <div className="quiz-input-section">
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
            
            <button 
              onClick={() => setShowAnswer(true)} 
              className="quiz-show-answer-btn"
              disabled={!userAnswer.trim()}
            >
              {userAnswer.trim() ? "Check Answer" : "Type your answer first"}
            </button>
          </div>
        )}

        {/* Answer reveal section */}
        {showAnswer && (
          <div className="quiz-answer-section">
            {/* User's answer */}
            <div className="quiz-your-answer">
              <div className="quiz-answer-label">Your Answer</div>
              <div className="quiz-user-answer">
                {userAnswer || "(No answer provided)"}
              </div>
            </div>

            {/* Correct answer */}
            <div className="quiz-correct-answer-container">
              <div className="correct-answer-label">Correct Answer</div>
              <div className="correct-answer-text">{question.answer}</div>
            </div>

            {/* Rating buttons */}
            <div className="quiz-rating-section">
              <p className="rating-instruction">
                How well did you know this?
              </p>
              
              <div className="rating-buttons-grid">
                <button 
                  onClick={() => handleRating("again")}
                  className="rating-btn rating-again"
                >
                  <span className="rating-icon">🔄</span>
                  <span>Again</span>
                  <small>Forgot completely</small>
                </button>
                
                <button 
                  onClick={() => handleRating("hard")}
                  className="rating-btn rating-hard"
                >
                  <span className="rating-icon">😓</span>
                  <span>Hard</span>
                  <small>Almost forgot</small>
                </button>
                
                <button 
                  onClick={() => handleRating("good")}
                  className="rating-btn rating-good"
                >
                  <span className="rating-icon">😊</span>
                  <span>Good</span>
                  <small>Knew it</small>
                </button>
                
                <button 
                  onClick={() => handleRating("easy")}
                  className="rating-btn rating-easy"
                >
                  <span className="rating-icon">🎯</span>
                  <span>Easy</span>
                  <small>Too easy</small>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

