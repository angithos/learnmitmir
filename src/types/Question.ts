import { Timestamp } from "firebase/firestore";

export type QuestionStyle = "translation" | "article" | "mcq";

export interface Question {
    id: string;
    userId: string;
    language: string;        // e.g. "German"
    level: "A1" | "A2" | "B1" | "B2";
    type: QuestionStyle;
    prompt: string;
    answer: string;
    options?: string[];      // for MCQ
    nextReview: Timestamp;
    interval: number;
    easeFactor: number;
    repetitions: number;
    createdAt: Timestamp;
  }
