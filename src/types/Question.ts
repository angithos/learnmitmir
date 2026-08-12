

import { Timestamp } from "firebase/firestore";

export interface Question {
  id: string;

  topic: string;
  subtopic: string;

  conceptId: string;

  type:
  | "mcq"
  | "fill_blank"
  | "typing"

  prompt: string;
  answer: string;

  options?: string[];

  difficulty?: number;

  explanation?: string;

  createdAt: Timestamp;

  tags?: string[]
}