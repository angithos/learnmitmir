import { Timestamp } from "firebase/firestore";

export interface UserQuestionProgress {
  questionId: string;

  interval: number;
  easeFactor: number;
  repetitions: number;

  nextReview: Timestamp;

  lastReviewed?: Timestamp;

  totalAttempts?: number;
  correctAttempts?: number;
}