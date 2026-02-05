import { Timestamp, collection, doc, getDocs, limit, query, where } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseconfig";
import { Question } from "../types/Question";
import { QuestionStyle } from "../types/Question";

export const FetchQuestions = async () => {
    const user = auth.currentUser;
    if (!user) return [];
    // debugger
    const q = query(
      collection(db, "users", user.uid, "questions"),
      // where("nextReview", "<=", Timestamp.now()),
      limit(20)
    );

    const snapshot = await getDocs(q);

    const questions: Question[] = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,              // ✅ IMPORTANT
      ...(docSnap.data() as Omit<Question, "id">),
    }));
    debugger
    return questions;

    
  };

  const getQuestions = (questionType: QuestionStyle, questions: Question[]) => {
    questions.filter((q) => q.type === questionType)
  }


