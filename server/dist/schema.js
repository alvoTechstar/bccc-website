"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertGivingRecordSchema = exports.insertContactMessageSchema = exports.insertBlogPostSchema = exports.insertUserSchema = exports.givingRecordSchema = exports.contactMessageSchema = exports.blogPostSchema = exports.userSchema = void 0;
const zod_1 = require("zod");
// Define the base schemas using Zod instead of Drizzle
exports.userSchema = zod_1.z.object({
    id: zod_1.z.string(),
    username: zod_1.z.string(),
    password: zod_1.z.string(),
});
exports.blogPostSchema = zod_1.z.object({
    id: zod_1.z.string(),
    title: zod_1.z.string(),
    content: zod_1.z.string(),
    excerpt: zod_1.z.string(),
    category: zod_1.z.string(),
    author: zod_1.z.string(),
    imageUrl: zod_1.z.string().optional(),
    published: zod_1.z.boolean().default(true),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
});
exports.contactMessageSchema = zod_1.z.object({
    id: zod_1.z.string(),
    firstName: zod_1.z.string(),
    lastName: zod_1.z.string(),
    email: zod_1.z.string().email(),
    phone: zod_1.z.string().optional(),
    subject: zod_1.z.string(),
    message: zod_1.z.string(),
    newsletter: zod_1.z.boolean().default(false),
    createdAt: zod_1.z.date(),
});
// Updated giving record schema with proper amount handling
exports.givingRecordSchema = zod_1.z.object({
    id: zod_1.z.string(),
    amount: zod_1.z.union([zod_1.z.string(), zod_1.z.number()]).transform(val => {
        if (typeof val === 'string') {
            const parsed = parseFloat(val);
            if (isNaN(parsed) || parsed <= 0) {
                throw new Error('Amount must be a positive number');
            }
            return parsed;
        }
        if (val <= 0) {
            throw new Error('Amount must be a positive number');
        }
        return val;
    }),
    givingType: zod_1.z.string(),
    phoneNumber: zod_1.z.string().min(1, "Phone number is required"),
    message: zod_1.z.string().optional(),
    transactionId: zod_1.z.string().optional(),
    status: zod_1.z.string().default("pending"),
    createdAt: zod_1.z.date(),
});
// Insert schemas (omit auto-generated fields)
exports.insertUserSchema = exports.userSchema.omit({
    id: true,
});
exports.insertBlogPostSchema = exports.blogPostSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertContactMessageSchema = exports.contactMessageSchema.omit({
    id: true,
    createdAt: true,
});
exports.insertGivingRecordSchema = exports.givingRecordSchema.omit({
    id: true,
    createdAt: true,
    transactionId: true,
    status: true,
});
