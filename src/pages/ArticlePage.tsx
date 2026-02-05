import { Question } from "../types/Question";

type Props = {
  questions: Question[];
  onAnswer: (
    question: Question,
    rating: "again" | "hard" | "good" | "easy"
  ) => void;
};

export default function ArticlePage({ questions, onAnswer }: Props) {
  if (questions.length === 0) {
    return <p>No article questions due 🎉</p>;
  }

  const current = questions[0];

  return (
    <div>
      <h2>Choose the correct article</h2>

      <h3 style={{ margin: "20px 0" }}>
        {current.prompt}
      </h3>

      <div style={{ display: "flex", gap: "10px" }}>
        {current.options?.map((option) => (
          <button
            key={option}
            onClick={() =>
              onAnswer(
                current,
                option === current.answer ? "good" : "again"
              )
            }
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
