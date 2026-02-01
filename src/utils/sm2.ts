export type Rating = "again" | "hard" | "good" | "easy";

const qualityMap: Record<Rating, number> = {
  again: 0,
  hard: 3,
  good: 4,
  easy: 5,
};

export function sm2(
  question: {
    interval: number;
    easeFactor: number;
    repetitions: number;
  },
  rating: Rating
) {
  let { interval, easeFactor, repetitions } = question;
  const quality = qualityMap[rating];

  // Ease factor update
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

  return {
    interval,
    easeFactor,
    repetitions,
  };
}
