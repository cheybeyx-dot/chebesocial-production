import { ZodSchema } from "zod";

export function validateInput<T>(
  schema: ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: string } {
  try {
    const parsed = schema.parse(data);
    return { success: true, data: parsed };
  } catch (err: any) {
    return {
      success: false,
      error: err.errors?.[0]?.message || "Invalid input",
    };
  }
}
