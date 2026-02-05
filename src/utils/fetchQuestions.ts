import { collection, getDocs, limit, query } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseconfig";
import { Question, QuestionStyle } from "../types/Question";

export const FetchQuestions = async () => {
  const user = auth.currentUser;
  if (!user) return [];
  const q = query(
    collection(db, "users", user.uid, "questions"),
    // where("nextReview", "<=", Timestamp.now()),
    limit(20),
  );

  const snapshot = await getDocs(q);

  const questions: Question[] = snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...(docSnap.data() as Omit<Question, "id">),
  }));
  return questions;
};

export const getQuestions = (
  questionType: QuestionStyle,
  questions: Question[],
) => {
  return questions.filter((q) => q.type === questionType);
};
