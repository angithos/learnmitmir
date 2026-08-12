// export type Rating = "again" | "hard" | "good" | "easy";

// const qualityMap: Record<Rating, number> = {
//   again: 0,
//   hard: 3,
//   good: 4,
//   easy: 5,
// };


// export function sm2(
//   question: {
//     interval: number;
//     easeFactor: number;
//     repetitions: number;
//   },
//   rating: Rating
// ) {
//   let { interval, easeFactor, repetitions } = question;
//   const quality = qualityMap[rating];

//   easeFactor =
//     easeFactor +
//     (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

//   if (easeFactor < 1.3) easeFactor = 1.3;

//   if (quality < 3) {
//     repetitions = 0;
//     interval = 1;
//   } else {
//     repetitions += 1;

//     if (repetitions === 1) interval = 1;
//     else if (repetitions === 2) interval = 6;
//     else interval = Math.round(interval * easeFactor);
//   }

//   const nextReview = Date.now() + interval * 24 * 60 * 60 * 1000;

//   return {
//     interval,
//     easeFactor,
//     repetitions,
//     nextReview,
//   };
// }
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { db, auth } from "../firebase/firebaseconfig"; // Make sure this path correctly points to your config file

export type Rating = "again" | "hard" | "good" | "easy";

const qualityMap: Record<Rating, number> = {
  again: 0,
  hard: 3,
  good: 4,
  easy: 5,
};

export interface SM2State {
  interval: number;
  easeFactor: number;
  repetitions: number;
}

export function sm2(question: SM2State, rating: Rating) {
  let { interval, easeFactor, repetitions } = question;
  const quality = qualityMap[rating];

  easeFactor =
    easeFactor +
    (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

  if (easeFactor < 1.3) easeFactor = 1.3;

  if (quality < 3) {
    repetitions = 0;
    interval = 1;
  } else {
    repetitions += 1;

    if (repetitions === 1) interval = 1;
    else if (repetitions === 2) interval = 6;
    else interval = Math.round(interval * easeFactor);
  }

  // Calculate review time in milliseconds
  const nextReviewMs = Date.now() + interval * 24 * 60 * 60 * 1000;

  return {
    interval,
    easeFactor,
    repetitions,
    nextReview: nextReviewMs,
  };
}

/**
 * Saves or updates a user's SM2 schedule for a specific question in Firestore.
 * Database Architecture: users / {uid} / progress / {questionId}
 */
export async function saveReviewProgress(
  questionId: string,
  topic: string,
  rating: Rating,
  currentState: SM2State
) {
  const user = auth.currentUser;
  
  if (!user) {
    console.error("No authenticated user found. Cannot save progress.");
    return;
  }

  // Calculate the new schedule states using the sm2 function
  const updatedData = sm2(currentState, rating);

  try {
    // Reference points to: users/{uid}/progress/{questionId}
    const docRef = doc(db, "users", user.uid, "progress", questionId);
    
    await setDoc(docRef, {
      questionId,
      topic,
      interval: updatedData.interval,
      easeFactor: updatedData.easeFactor,
      repetitions: updatedData.repetitions,
      // Convert nextReview timestamp to a real Firestore Timestamp for easier filtering queries
      nextReview: Timestamp.fromMillis(updatedData.nextReview),
      lastReviewed: Timestamp.now(),
      lastRating: rating
    }, { merge: true }); // Merge ensures we don't accidentally wipe out other metadata

    console.log(`Successfully saved progress for question: ${questionId}`);
  } catch (error) {
    console.error("Error saving SM2 progress to Firestore:", error);
  }
}



