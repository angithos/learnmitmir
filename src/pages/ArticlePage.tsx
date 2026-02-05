import React, { useEffect, useState } from "react";
import { Question } from "../types/Question";
import { FetchQuestions, getQuestions } from "../utils/fetchQuestions";

export default function ArticlePage() {
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    const load = async () => {
      const qs = await FetchQuestions();
      setQuestions(qs);
    };
    load();
  }, []);

  const articleQuestions = getQuestions("article", questions);

  return (
    <div style={{ padding: 20 }}>
      <h1>Article</h1>
      <p>Found {articleQuestions.length} article question(s).</p>
      <ul>
        {articleQuestions.map((q) => (
          <li key={q.id}>{q.prompt}</li>
        ))}
      </ul>
    </div>
  );
}
