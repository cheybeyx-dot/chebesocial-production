const requests = new Map<string, number>();

export function rateLimit(key: string) {
  const now = Date.now();
  const last = requests.get(key) || 0;

  if (now - last < 10_000) {
    throw new Error("Too many requests. Slow down.");
  }

  requests.set(key, now);
}
