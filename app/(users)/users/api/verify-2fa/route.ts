import { authenticator } from "otplib";

// In-memory store for secret keys (replace with a database in production)
const userSecrets: { [userId: string]: string } = {};

export async function POST(request: Request) {
  const { userId, token } = await request.json();

  if (!userId || !token) {
    return new Response(
      JSON.stringify({ error: "User ID and token are required" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const secret = userSecrets[userId];

  if (!secret) {
    return new Response(
      JSON.stringify({ error: "User not found or 2FA not set up" }),
      {
        status: 404,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const isValid = authenticator.verify({ token, secret });

  return new Response(JSON.stringify({ isValid }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
