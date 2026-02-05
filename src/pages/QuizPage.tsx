
import { Timestamp, collection, doc, getDocs, limit, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Question } from "../types/Question";
import { Rating, sm2 } from "../utils/sm2";
import { auth, db } from "../firebase/firebaseconfig";
import Quiz from "../components/Quiz";



export default function QuizPage({domain}:any){
    const user = auth.currentUser;
    const [questions, setQuestions] = useState<Question[]>([]);

const [showquiz, setShowQuiz] = useState<boolean>(false)

// useEffect(() => {
//   debugger;
// }, [questions])

    const FetchQuestions = async () => {
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
    const translationQuestions = questions.filter(
       
        (q) => q.type == "translation"
      );


      // const load = async () => {
      //   const qs = await FetchQuestions();
      //   setQuestions(qs);
      // };
      // load();

        // new code added
  const articleQuestions = questions.filter(
    (q) => q.type === "article"
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


      const loadQuestions = async () => {
        const qs = await FetchQuestions();
        setQuestions(qs);
      };
      loadQuestions();
 

    return <div>
        {/* <input type="button" onClick={() => setShowQuiz(!showquiz)} value={showquiz ? "sTART QUIZ" : "END qUIZ"} /> */}

       {/* if the activeState == transaltion{article component } otherwise if activeState == Article then run article component  */}
       {
        
        <Quiz questions={translationQuestions} onAnswer={handleAnswer}/>
       }  

        
    </div>
}