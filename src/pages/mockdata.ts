import { Question } from "../types/Question";
import { Timestamp } from "firebase/firestore";

export const MOCK_QUESTIONS: Record<string, Question[]> = {
  nominativ: [
    {
      id: "nom_01",
      topic: "nominativ",
      subtopic: "definite_articles",
      conceptId: "nom_def_art",
      type: "mcq", // Converted from fill_blank
      prompt: "___ Mann ist hier. (The man is here.)",
      answer: "Der",
      options: ["Der", "Die", "Das", "Den"], // Added options
      difficulty: 1,
      explanation: "'Mann' is masculine and functions as the subject of the sentence, requiring the Nominativ masculine definite article 'Der'.",
      createdAt: Timestamp.now(),
      tags: ["articles", "masculine"]
    },
    {
      id: "nom_02",
      topic: "nominativ",
      subtopic: "pronouns",
      conceptId: "nom_pron",
      type: "typing",
      prompt: "Translate: 'He is sleeping.'",
      answer: "Er schläft",
      difficulty: 1,
      explanation: "The pronoun 'He' acts as the subject, which translates to 'Er' in the Nominativ case.",
      createdAt: Timestamp.now(),
      tags: ["pronouns", "verbs"]
    },
    {
      id: "nom_03",
      topic: "nominativ",
      subtopic: "plural_articles",
      conceptId: "nom_pl_art",
      type: "mcq",
      prompt: "Which article completes the sentence: '___ Kinder spielen im Garten.'?",
      answer: "Die",
      options: ["Der", "Die", "Das", "Den"],
      difficulty: 1,
      explanation: "'Kinder' is plural and the subject, so it takes the plural Nominativ article 'Die'.",
      createdAt: Timestamp.now(),
      tags: ["plural", "articles"]
    }
  ],
  akkusativ: [
    {
      id: "akk_01",
      topic: "akkusativ",
      subtopic: "masculine_objects",
      conceptId: "akk_masc_obj",
      type: "mcq",
      prompt: "Ich habe ___ Hund. (I have a dog.)",
      answer: "einen",
      options: ["ein", "eine", "einen", "einem"],
      difficulty: 2,
      explanation: "'Hund' is masculine. Since it is the direct object of the verb 'haben', it changes from 'ein' to 'einen' in the Akkusativ case.",
      createdAt: Timestamp.now(),
      tags: ["indefinite_articles", "masculine"]
    },
    {
      id: "akk_02",
      topic: "akkusativ",
      subtopic: "prepositions",
      conceptId: "akk_prep",
      type: "mcq",
      prompt: "Which preposition always forces the Akkusativ case?",
      answer: "für",
      options: ["mit", "nach", "für", "von"],
      difficulty: 2,
      explanation: "'Für' is an Akkusativ-only preposition (along with durch, gegen, ohne, um).",
      createdAt: Timestamp.now(),
      tags: ["prepositions"]
    },
    {
      id: "akk_03",
      topic: "akkusativ",
      subtopic: "pronouns",
      conceptId: "akk_pron",
      type: "typing",
      prompt: "Translate: 'I love you.' (singular informal)",
      answer: "Ich liebe dich",
      difficulty: 1,
      explanation: "The informal 'you' acts as the direct object of 'lieben', turning 'du' into the Akkusativ pronoun 'dich'.",
      createdAt: Timestamp.now(),
      tags: ["pronouns"]
    }
  ],
  dativ: [
    {
      id: "dat_01",
      topic: "dativ",
      subtopic: "masculine_indirect",
      conceptId: "dat_masc_ind",
      type: "mcq", // Converted from fill_blank
      prompt: "Ich helfe ___ Vater. (I help the father.)",
      answer: "dem",
      options: ["der", "die", "den", "dem"], // Added options
      difficulty: 3,
      explanation: "The verb 'helfen' is a Dativ verb. The masculine article 'der' changes to 'dem' when it becomes a Dativ object.",
      createdAt: Timestamp.now(),
      tags: ["verbs", "definite_articles"]
    },
    {
      id: "dat_02",
      topic: "dativ",
      subtopic: "prepositions",
      conceptId: "dat_prep",
      type: "mcq",
      prompt: "Complete the sentence: 'Ich gehe mit ___ Freundin ins Kino.' (I am going to the cinema with my girlfriend.)",
      answer: "meiner",
      options: ["meine", "meinen", "meiner", "meinem"],
      difficulty: 3,
      explanation: "The preposition 'mit' requires the Dativ case. 'Freundin' is feminine, so the possessive pronoun changes to 'meiner'.",
      createdAt: Timestamp.now(),
      tags: ["prepositions", "possessive"]
    },
    {
      id: "dat_03",
      topic: "dativ",
      subtopic: "pronouns",
      conceptId: "dat_pron",
      type: "typing",
      prompt: "Translate: 'How are you?' (Literal: How goes it to you? - informal singular)",
      answer: "Wie geht es dir",
      difficulty: 2,
      explanation: "The idiomatic expression 'Wie geht es...' requires a Dativ pronoun. 'Du' becomes 'dir'.",
      createdAt: Timestamp.now(),
      tags: ["idioms", "pronouns"]
    }
  ]
};