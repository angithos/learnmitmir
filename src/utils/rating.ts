import { EvaluationResultType } from "./evaluation";

export function mapToRating(
  result: EvaluationResultType
): "again" | "hard" | "good" | "easy" {
  const { isCorrect, accuracy, timeTaken, expectedTime } = result;

  if (!isCorrect) return "again";

  const speed = timeTaken / expectedTime;

  console.log({
    timeTaken,
    expectedTime: result.expectedTime,
    speed: timeTaken / result.expectedTime,
  });

if (speed < 0.8) return "easy";

else if (speed < 1.5) return "good";

return "hard";


}