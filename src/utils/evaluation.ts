  export type EvaluationResultType = {
    isCorrect: boolean;
    accuracy: number;
    timeTaken: number;
    expectedTime: number;
  };
//thios is a evaluation trnaslation

export function evaluateTranslations(
    userAnswer: string,
    correctAnswer: string,
    timeTaken: number
  ): EvaluationResultType {
    const correctAn = correctAnswer.toLowerCase().trim();
    const user = userAnswer.toLowerCase().trim();
  
    const isCorrect = correctAn === user;
  
    return {
      isCorrect,
      accuracy: isCorrect ? 1 : 0,
      timeTaken,
      expectedTime: 8000
    };
  }
//this is evaluation Article

    export function evaluateArticle(
    userAnswer: string,
    correctAnswer: string,
    timeTaken: number
  ): EvaluationResultType {
    const isCorrect = userAnswer === correctAnswer;


//this is evaluation Article quiz
    return {
      isCorrect,
      accuracy: isCorrect ? 0.9 : 0, // not 1
      timeTaken,
      expectedTime: 4000,
    };
  }