// ResultsPage.tsx
import { useNavigate } from "react-router";

interface AnswerResult {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  rating: "again" | "hard" | "good" | "easy";
}

interface ResultsPageProps {
  answers: AnswerResult[];
}

export default function ResultsPage({ answers }: ResultsPageProps) {
  const navigate = useNavigate();
  
  const correctCount = answers.filter(a => a.isCorrect).length;
  const totalCount = answers.length;
  const percentage = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

  return (
    <div className="results-container">
      <div className="results-card">
        <div className="results-header">
          <h1 className="results-title">Quiz Results</h1>
          <div className="results-score">
            <div className="score-circle">
              <span className="score-percentage">{percentage}%</span>
              <span className="score-text">Score</span>
            </div>
            <div className="score-breakdown">
              <p>{correctCount} out of {totalCount} correct</p>
            </div>
          </div>
        </div>

        <div className="results-details">
          <h2 className="details-title">Detailed Results</h2>
          
          <div className="answers-list">
            {answers.map((answer, index) => (
              <div 
                key={index} 
                className={`answer-card ${answer.isCorrect ? 'correct' : 'incorrect'}`}
              >
                <div className="answer-question">
                  <span className="question-number">Q{index + 1}:</span>
                  <span className="question-text">{answer.question}</span>
                </div>
                
                <div className="answer-comparison">
                  <div className="user-answer">
                    <span className="answer-label">Your Answer:</span>
                    <span className="answer-value">{answer.userAnswer || "(No answer)"}</span>
                  </div>
                  
                  <div className="correct-answer">
                    <span className="answer-label">Correct Answer:</span>
                    <span className="answer-value">{answer.correctAnswer}</span>
                  </div>
                </div>
                
                <div className="answer-status">
                  <span className={`status-badge ${answer.isCorrect ? 'status-correct' : 'status-incorrect'}`}>
                    {answer.isCorrect ? "✓ Correct" : "✗ Incorrect"}
                  </span>
                  <span className={`rating-badge rating-${answer.rating}`}>
                    {answer.rating.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="results-actions">
          <button 
            className="btn btn-primary"
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
          </button>
          
          <button 
            className="btn btn-secondary"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}