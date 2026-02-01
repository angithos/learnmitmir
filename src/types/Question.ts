import { Timestamp } from "firebase/firestore";

export interface Question {
    id: string;
    userId: string;
    language: string;        // e.g. "German"
    level: "A1" | "A2" | "B1" | "B2";
    type: "translation" | "article" | "mcq";
    prompt: string;
    answer: string;
    options?: string[];      // for MCQ
    nextReview: Timestamp;
    interval: number;
    easeFactor: number;
    repetitions: number;
    createdAt: Timestamp;
  }
