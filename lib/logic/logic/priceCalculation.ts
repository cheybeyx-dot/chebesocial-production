
export function calculatePrice(ratePer1k: number, quantity: number): number {
  return (quantity / 1000) * ratePer1k;
}
