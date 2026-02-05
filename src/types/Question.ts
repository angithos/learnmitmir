import { Timestamp } from "firebase/firestore";

export type QuestionStyle = "translation" | "article" | "mcq";
export type Level = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export interface Question {
  id: string;
  userId: string;
  language: string; // e.g. "German"
  level: Level;
  type: QuestionStyle;
  prompt: string;
  answer: string;
  options?: string[]; // for MCQ
  nextReview: Timestamp;
  interval: number;
  easeFactor: number;
  repetitions: number;
  createdAt: Timestamp;
}
