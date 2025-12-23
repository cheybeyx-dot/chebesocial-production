export function generateOrderId(): string {
  const timestamp = Date.now().toString(36); // Convert current timestamp to base 36
  const randomStr = Math.random().toString(36).substring(2, 7); // Generate a random string
  return `ORD-${timestamp}-${randomStr}`.toUpperCase();
}
