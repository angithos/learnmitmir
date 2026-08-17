import { collection, getDocs, query, where, Timestamp } from "firebase/firestore";
import { db, auth } from "../firebase/firebaseconfig";
import { MOCK_QUESTIONS } from "../pages/mockdata";
import { Question } from "../types/Question";
import { SM2State } from "./sm2"; // Or wherever your SM2State interface lives

// We create a new type that holds the question data AND its current SM2 history
export interface ReviewQuestion extends Question {
  sm2State: SM2State;
}

/**
 * Fetches all items from Firestore that are due for review and matches them 
 * with their question text data.
 * 
 * @param isTestingMode - If true, fetches items due up to 48 hours from now so you can test instantly.
 */

export async function fetchDueReviews(isTestingMode = false): Promise<ReviewQuestion[]> {
  const user = auth.currentUser;
  if (!user) {
    console.error("No authenticated user found.");
    return [];
  }

  // Determine the cutoff timestamp
  let cutoffTime = new Date();
  if (isTestingMode) {
    // Look ahead 2 days so questions scheduled for "tomorrow" show up immediately for testing
    cutoffTime.setDate(cutoffTime.getDate() + 2);
  }

  try {
    // 1. Query the nested progress collection
    const progressRef = collection(db, "users", user.uid, "progress");
    const q = query(progressRef, where("nextReview", "<=", Timestamp.fromDate(cutoffTime)));
    
    const querySnapshot = await getDocs(q);
    const dueQuestions: ReviewQuestion[] = [];

    // Flatten all mock categories into a single array for quick ID lookup
    const allMockQuestions = Object.values(MOCK_QUESTIONS).flat();

    // 2. Loop through tracking logs and match them with real question content
    querySnapshot.forEach((docSnap) => {
      const progressData = docSnap.data();
      
      // Find the text prompt and answer details using the logged questionId
      const matchedQuestion = allMockQuestions.find(q => q.id === progressData.questionId);

      if (matchedQuestion) {
        dueQuestions.push({
          ...matchedQuestion,
          sm2State: {
            interval: progressData.interval || 0,
            easeFactor: progressData.easeFactor || 2.5,
            repetitions: progressData.repetitions || 0,
          }
        });
      }
    });

    return dueQuestions;
  } catch (error) {
    console.error("Error fetching due reviews:", error);
    return [];
  }
}

export async function fetchQuizQuestions(): Promise<Question[] | null> {
  const user = auth.currentUser;

  if (user === null) {
      console.log("No authenticated user");
      return null;
  }

  const questionsRef = collection(
      db,
      "users",
      user.uid,
      "questions"
  );

  const querySnapshot = await getDocs(questionsRef);

  console.log("Number of documents:", querySnapshot.size);



  const questions: Question[] = [];

  querySnapshot.forEach((docSnap) => {
      const questionData = docSnap.data() as Question;
      questions.push(questionData);
  });

  return questions.slice(0, 10);
}