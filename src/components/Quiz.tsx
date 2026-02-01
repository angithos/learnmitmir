import { useState } from "react";
import { Question } from "../types/Question";

interface QuizProps {
  questions: Question[];
  onAnswer: (
    question: Question,
    rating: "again" | "hard" | "good" | "easy"
  ) => void;
}

export default function Quiz({ questions, onAnswer }: QuizProps) {
  const [index, setIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);

  if (questions.length === 0) {
    return <p>No questions to review today 🎉</p>;
  }

  const question = questions[index];

  const handleRating = (rating: "again" | "hard" | "good" | "easy") => {
    onAnswer(question, rating);

    // reset state
    setUserAnswer("");
    setShowAnswer(false);
    setIndex((i) => i + 1);
    
  };

  if (index >= questions.length) {
    return <p>Session completed ✅</p>;
  }

  return (
    <div style={{ maxWidth: 500, margin: "0 auto" }}>
      <h3>
        Question {index + 1} / {questions.length}
      </h3>

      <p style={{ fontSize: 18 }}>{question.prompt}</p>

      {!showAnswer && (
        <>
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Type your answer"
            style={{ width: "100%", padding: 8 }}
          />

          <button onClick={() => setShowAnswer(true)}>
            Show Answer
          </button>
        </>
      )}

      {showAnswer && (
        <>
          <p>
            <strong>Correct answer:</strong> {question.answer}
          </p>

          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => handleRating("again")}>Again</button>
            <button onClick={() => handleRating("hard")}>Hard</button>
            <button onClick={() => handleRating("good")}>Good</button>
            <button onClick={() => handleRating("easy")}>Easy</button>
          </div>
        </>
      )}
    </div>
  );
}
