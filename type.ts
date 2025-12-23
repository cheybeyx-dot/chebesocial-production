import { z } from "zod";

export const formSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("buyAccount"),
    quantity: z.number(),
    price: z.number(),
    adlink: z.string().optional(),
  }),
  z.object({
    type: z.literal("regular"),
    quantity: z.number(),
    price: z.number(),
    adlink: z.string(),
  }),
  z.object({
    type: z.literal("api"),
    quantity: z.number(),
    price: z.number(),
    adlink: z.string(),
    service: z.string(),
  }),
]);

export type FormData = z.infer<typeof formSchema>;
