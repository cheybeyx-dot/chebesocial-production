const rateMap = new Map<string, number>();

export function rateLimit(key: string, limit = 5) {
  const now = Date.now();
  const last = rateMap.get(key) || 0;

  if (now - last < 10_000) {
    throw new Error("Too many requests. Slow down.");
  }

  rateMap.set(key, now);
}
