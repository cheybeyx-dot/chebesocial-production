import { authenticator } from "otplib";
import QRCode from "qrcode";

// In-memory store for secret keys (replace with a database in production)
const userSecrets: { [userId: string]: string } = {};

export async function POST(request: Request) {
  const { userId } = await request.json();

  if (!userId) {
    return new Response(JSON.stringify({ error: "User ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const secret = authenticator.generateSecret();
  userSecrets[userId] = secret;

  const otpauth = authenticator.keyuri(userId, "Chebesocial", secret);
  const qrCodeDataUrl = await QRCode.toDataURL(otpauth);

  return new Response(JSON.stringify({ secret, qrCodeDataUrl }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
