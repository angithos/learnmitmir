import { useNavigate } from "react-router";
import React from "react";
import { Rating } from "../utils/sm2";

export interface AnswerResult {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  rating: Rating;
}

interface ResultsPageProps {
  answers: AnswerResult[];
}

function formatPercentage(correct: number, total: number) {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}

function AnswerCard({
  answer,
  index,
}: Readonly<{
  answer: AnswerResult;
  index: number;
}>) {
  const key = answer.question || String(index);
  return (
    <div
      className={`answer-card ${answer.isCorrect ? "correct" : "incorrect"}`}
      key={key}
    >
      <div className="answer-question">
        <strong className="question-number">Q{index + 1}:</strong>
        <span className="question-text">{answer.question}</span>
      </div>

      <div className="answer-comparison">
        <div>
          <div className="answer-label">Your Answer</div>
          <div className="answer-value">
            {answer.userAnswer || "(No answer)"}
          </div>
        </div>

        <div>
          <div className="answer-label">Correct Answer</div>
          <div className="answer-value">{answer.correctAnswer}</div>
        </div>
      </div>

      <div className="answer-status">
        <span
          className={`status-badge ${answer.isCorrect ? "status-correct" : "status-incorrect"}`}
        >
          {answer.isCorrect ? "✓ Correct" : "✗ Incorrect"}
        </span>
        <span className={`rating-badge rating-${answer.rating}`}>
          {answer.rating.toUpperCase()}
        </span>
      </div>
    </div>
  );
}

export default function ResultsPage({ answers }: Readonly<ResultsPageProps>) {
  const navigate = useNavigate();

  const correctCount = answers.filter((a) => a.isCorrect).length;
  const totalCount = answers.length;
  const percentage = formatPercentage(correctCount, totalCount);

  return (
    <div className="results-container">
      <div className="results-card">
        <header className="results-header">
          <h1 className="results-title">Quiz Results</h1>

          <div className="results-score">
            <div className="score-circle">
              <span className="score-percentage">{percentage}%</span>
              <span className="score-text">Score</span>
            </div>
            <div className="score-breakdown">
              <p>
                {correctCount} out of {totalCount} correct
              </p>
            </div>
          </div>
        </header>

        <section className="results-details">
          <h2 className="details-title">Detailed Results</h2>
          <div className="answers-list">
            {answers.map((answer, i) => (
              <AnswerCard
                answer={answer}
                index={i}
                key={answer.question ?? i}
              />
            ))}
          </div>
        </section>

        <footer className="results-actions">
          <button
            className="btn btn-primary"
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => globalThis.location.reload()}
          >
            Try Again
          </button>
        </footer>
      </div>
    </div>
  );
}
