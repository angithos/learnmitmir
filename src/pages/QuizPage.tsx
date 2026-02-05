import { Timestamp, doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Question } from "../types/Question";
import { Rating, sm2 } from "../utils/sm2";
import { auth, db } from "../firebase/firebaseconfig";
import { FetchQuestions, getQuestions } from "../utils/fetchQuestions";
import Quiz from "../components/Quiz";

export default function QuizPage() {
  const user = auth.currentUser;
  const [questions, setQuestions] = useState<Question[]>([]);

  const translationQuestions = getQuestions("translation", questions);
  const handleAnswer = async (question: Question, rating: Rating) => {
    const { interval } = sm2(question, rating);
    const nextReview = Timestamp.fromMillis(
      Date.now() + interval * 24 * 60 * 60 * 1000,
    );
    console.log(
      "Question ID:",
      question.id,
      "nextReview:",
      nextReview.toMillis(),
    );
    if (user) {
      const ref = doc(db, "users", user.uid, "questions", question.id);
      console.log("Would update", ref.path, { interval, nextReview });
    }
  };

  useEffect(() => {
    const loadQuestions = async () => {
      const qs = await FetchQuestions();
      setQuestions(qs);
    };
    loadQuestions();
  }, []);

  return (
    <div>
      <Quiz questions={translationQuestions} onAnswer={handleAnswer} />
    </div>
  );
}
