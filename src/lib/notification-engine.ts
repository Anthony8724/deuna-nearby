export function generateNearbyMoment(
  category: string,
  businessName: string,
  distanceMeters: number,
  discount: number
) {
  return `Vimos que últimamente te interesan las ${category.toLowerCase()}. ${businessName} está a ${distanceMeters}m y tiene un beneficio DeUna exclusivo del ${discount}%.`;
}