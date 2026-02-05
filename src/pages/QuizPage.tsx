import {
  Timestamp,
  collection,
  doc,
  getDocs,
  limit,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { Question } from "../types/Question";
import { Rating, sm2 } from "../utils/sm2";
import { auth, db } from "../firebase/firebaseconfig";
import Quiz from "../components/Quiz";

export default function QuizPage() {
  const user = auth.currentUser;
  const [questions, setQuestions] = useState<Question[]>([]);

  const translationQuestions = questions.filter(
    (q) => q.type === "translation",
  );
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
      if (!user) return;
      const q = query(
        collection(db, "users", user.uid, "questions"),
        limit(20),
      );
      const snapshot = await getDocs(q);
      const qs: Question[] = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<Question, "id">),
      }));
      setQuestions(qs);
    };
    loadQuestions();
  }, [user]);

  return (
    <div>
      <Quiz questions={translationQuestions} onAnswer={handleAnswer} />
    </div>
  );
}
