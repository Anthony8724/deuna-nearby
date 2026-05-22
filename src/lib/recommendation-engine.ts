export function calculateRecommendationScore(
  businessCategory: string,
  favoriteCategory: string,
  distanceMeters: number,
  discount: number
) {
  let score = 0;

  if (businessCategory === favoriteCategory) {
    score += 50;
  }

  if (distanceMeters <= 300) {
    score += 30;
  } else if (distanceMeters <= 800) {
    score += 20;
  } else {
    score += 10;
  }

  if (discount >= 15) {
    score += 20;
  } else if (discount >= 10) {
    score += 15;
  } else {
    score += 5;
  }

  return Math.min(score, 100);
}