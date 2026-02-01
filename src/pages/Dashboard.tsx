import { Question } from "../types/Question";
import Quiz from "../components/Quiz";
import { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebaseconfig";
import { Timestamp, collection, getDocs, limit, query, where } from "firebase/firestore";
import { doc, updateDoc } from "firebase/firestore";
import { Rating, sm2 } from "../utils/sm2";
import ArticleQuiz from "../components/fillintheblanks";


export default function Dashboard() {
  const user = auth.currentUser;

  const [questions, setQuestions] = useState<Question[]>([]);
  const [showquiz, setShowQuiz] = useState<boolean>(false)
  const [activeType, setActiveType] = useState<
  "translation" | "article" | null
>(null);
  

  const generateQuestions = async () => {

    if (!user) return;

    const token = await user.getIdToken();

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        token,
        language: "German",
        level: "A2",
      }),
    });

    const data = await res.json();
    console.log(data);

  };

  const FetchQuestions = async () => {
    if (!user) return [];

    const q = query(
      collection(db, "users", user.uid, "questions"),
      // where("nextReview", "<=", Timestamp.now()),
      limit(10)
    );

    const snapshot = await getDocs(q);

    const questions: Question[] = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,              // ✅ IMPORTANT
      ...(docSnap.data() as Omit<Question, "id">),
    }));

    return questions;
  };

  // new code added
  const articleQuestions = questions.filter(
    (q) => q.type === "article"
  );
  
  const translationQuestions = questions.filter(
    (q) => q.type === "translation"
  );
  
  const handleAnswer = async (question: Question, rating: Rating) => {
    const { interval, easeFactor, repetitions } = sm2(question, rating);


    console.log("Question ID:", question.id);

    const nextReview = Timestamp.fromMillis(
      Date.now() + interval * 24 * 60 * 60 * 1000
    );

    if (user) {
      const ref = doc(
        db,
        "users",
        user.uid,
        "questions",
        question.id
      );
      // await updateDoc(ref, {
      //   interval,
      //   easeFactor,
      //   repetitions,
      //   nextReview,
      // });
    }
  };
  const load = async () => {
    const qs = await FetchQuestions();
    setQuestions(qs);
  };
  load();

  return <div>
    <h1>Willkomen bei Dashbaord</h1>
    {/* <input type="button" onClick={generateQuestions} value={"click"}/> */}


    {/* <input type="button" onClick={()=>setShowArticleQuiz} value={"Show article "} />
    <input type="button" onClick={() => setShowQuiz(!showquiz)} value={showquiz ? "sTART QUIZ" : "END qUIZ"} />
    {
      showquiz ? <div><h1>No Quiz today</h1></div> : <Quiz questions={questions} onAnswer={handleAnswer} />
    } */}

<button onClick={() => setActiveType("translation")}>
  Translation Quiz
</button>

<button onClick={() => setActiveType("article")}>
  Article Quiz
</button>

{activeType === "translation" && (
  <Quiz
    questions={translationQuestions}
    onAnswer={handleAnswer}
  />
)}

{activeType === "article" && (
  <ArticleQuiz
    questions={articleQuestions}
    onAnswer={handleAnswer}
  />
)}

  </div>
}