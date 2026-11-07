import { type User, type InsertUser, type BlogPost, type InsertBlogPost, type ContactMessage, type InsertContactMessage, type GivingRecord, type InsertGivingRecord } from "./schema";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Blog methods
  getBlogPosts(limit?: number): Promise<BlogPost[]>;
  getBlogPost(id: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  getBlogPostsByCategory(category: string): Promise<BlogPost[]>;

  // Contact methods
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getContactMessages(): Promise<ContactMessage[]>;

  // Giving methods
  createGivingRecord(record: InsertGivingRecord): Promise<GivingRecord>;
  getGivingRecords(): Promise<GivingRecord[]>;
  getGivingRecord(id: string): Promise<GivingRecord | undefined>;
  updateGivingRecordStatus(id: string, status: string, transactionId?: string): Promise<GivingRecord | undefined>;
}

// Use MongoDB Atlas storage
import { MongoStorage } from "./mongo-storage";

export const storage = new MongoStorage();