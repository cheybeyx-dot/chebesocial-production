import { getAuth } from "firebase/auth";

export function requireAdmin(user: any) {
  if (!user?.claims?.admin) {
    throw new Error("Unauthorized");
  }
}
