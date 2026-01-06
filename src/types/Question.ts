export interface Question {
    id: string;
    userId: string;
    language: string;        // e.g. "German"
    level: "A1" | "A2" | "B1" | "B2";
    type: "translation" | "fill_blank" | "mcq";
    prompt: string;
    answer: string;
    options?: string[];      // for MCQ
    nextReview: Date;
    interval: number;
    easeFactor: number;
    createdAt: Date;
  }
