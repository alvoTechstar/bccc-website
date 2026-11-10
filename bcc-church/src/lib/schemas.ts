import { z } from "zod";

/**
 * Local form schemas — mirrors server/src/schema.ts.
 * Import from here ("@/lib/schemas") instead of "@shared/schema"
 * (which does not exist in this repo and breaks type-checking).
 */

export const blogPostSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  excerpt: z.string(),
  category: z.string(),
  author: z.string(),
  imageUrl: z.string().optional(),
  published: z.boolean().default(true),
  // Origin: "local" (in-house) or "facebook" (synced from the church page).
  source: z.string().optional(),
  sourceUrl: z.string().optional(),
  facebookPostId: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const contactMessageSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string(),
  message: z.string(),
  newsletter: z.boolean().default(false),
  createdAt: z.date(),
});

export const givingRecordSchema = z.object({
  id: z.string(),
  amount: z.union([z.string(), z.number()]).transform((val) => {
    if (typeof val === "string") {
      const parsed = parseFloat(val);
      if (isNaN(parsed) || parsed <= 0) {
        throw new Error("Amount must be a positive number");
      }
      return parsed;
    }
    if (val <= 0) {
      throw new Error("Amount must be a positive number");
    }
    return val;
  }),
  givingType: z.string(),
  phoneNumber: z.string().min(1, "Phone number is required"),
  // Optional — used for the M-Pesa thank-you email receipt.
  email: z.string().email("Invalid email address").optional(),
  message: z.string().optional(),
  transactionId: z.string().optional(),
  status: z.string().default("pending"),
  createdAt: z.date(),
});

export const insertContactMessageSchema = contactMessageSchema.omit({
  id: true,
  createdAt: true,
});

export const insertGivingRecordSchema = givingRecordSchema.omit({
  id: true,
  createdAt: true,
  transactionId: true,
  status: true,
});

export type BlogPost = z.infer<typeof blogPostSchema>;
export type InsertContactMessage = z.input<typeof insertContactMessageSchema>;
export type InsertGivingRecord = z.input<typeof insertGivingRecordSchema>;
