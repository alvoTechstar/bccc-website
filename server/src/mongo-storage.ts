import { Collection, Db } from "mongodb";
import { IStorage } from "./storage";
import {
  User,
  InsertUser,
  BlogPost,
  InsertBlogPost,
  ContactMessage,
  InsertContactMessage,
  GivingRecord,
  InsertGivingRecord
} from "./schema";
import { connectToDb } from "./db"; // Assuming this correctly returns a Promise<Db>
import { randomUUID } from "crypto";

export class MongoStorage implements IStorage {
  private db!: Db;
  private users!: Collection<User>;
  private blogPosts!: Collection<BlogPost>;
  private contactMessages!: Collection<ContactMessage>;
  private givingRecords!: Collection<GivingRecord>;
  private initialized = false;
  private initializationPromise: Promise<void> | null = null; // To prevent multiple concurrent initializations

  constructor() {
    // We don't initialize directly in the constructor to avoid sync/async issues.
    // Instead, methods will call ensureInitialized.
  }

  private async initialize(): Promise<void> {
    if (!this.initialized) {
      try {
        this.db = await connectToDb(); // Ensure connectToDb() returns a valid Db object
        if (!this.db) {
          throw new Error("Failed to connect to the database: connectToDb() returned undefined.");
        }
        this.users = this.db.collection<User>("users");
        this.blogPosts = this.db.collection<BlogPost>("blogPosts");
        this.contactMessages = this.db.collection<ContactMessage>("contactMessages");
        this.givingRecords = this.db.collection<GivingRecord>("givingRecords");
        this.initialized = true;
      } catch (error) {
        console.error("Error during storage initialization:", error);
        // Re-throw the error to be caught by the caller of ensureInitialized
        throw error;
      }
    }
  }

  private async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      // If initialization is already in progress, wait for it.
      if (!this.initializationPromise) {
        this.initializationPromise = this.initialize();
      }
      await this.initializationPromise;
    }
  }

  // --- Methods using ensureInitialized ---

  async getUser(id: string): Promise<User | undefined> {
    await this.ensureInitialized();
    const user = await this.users.findOne({ id });
    return user ?? undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    await this.ensureInitialized();
    const user = await this.users.findOne({ username });
    return user ?? undefined;
  }

  async createUser(user: InsertUser): Promise<User> {
    await this.ensureInitialized();
    const newUser: User = {
      ...user,
      id: randomUUID()
    };
    await this.users.insertOne(newUser);
    return newUser;
  }

  async getBlogPosts(limit?: number): Promise<BlogPost[]> {
    await this.ensureInitialized();
    const cursor = this.blogPosts.find();
    if (limit && limit > 0) {
      cursor.limit(limit);
    }
    return await cursor.toArray();
  }

  async getBlogPost(id: string): Promise<BlogPost | undefined> {
    await this.ensureInitialized();
    const post = await this.blogPosts.findOne({ id });
    return post ?? undefined;
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    await this.ensureInitialized();
    const newPost: BlogPost = {
      ...post,
      id: randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    await this.blogPosts.insertOne(newPost);
    return newPost;
  }

  async getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
    await this.ensureInitialized();
    return await this.blogPosts.find({ category }).toArray();
  }

  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    await this.ensureInitialized();
    const newMessage: ContactMessage = {
      ...message,
      id: randomUUID(),
      createdAt: new Date()
    };
    await this.contactMessages.insertOne(newMessage);
    return newMessage;
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    await this.ensureInitialized();
    return await this.contactMessages.find().toArray();
  }

  async createGivingRecord(record: InsertGivingRecord): Promise<GivingRecord> {
    await this.ensureInitialized();
    const newRecord: GivingRecord = {
      ...record,
      id: randomUUID(),
      createdAt: new Date(),
      status: "pending"
    };
    await this.givingRecords.insertOne(newRecord);
    return newRecord;
  }

  async getGivingRecords(): Promise<GivingRecord[]> {
    await this.ensureInitialized();
    return await this.givingRecords.find().toArray();
  }

  async getGivingRecord(id: string): Promise<GivingRecord | undefined> {
    await this.ensureInitialized();
    const record = await this.givingRecords.findOne({ id });
    return record ?? undefined;
  }

  async updateGivingRecordStatus(id: string, status: string, transactionId?: string): Promise<GivingRecord | undefined> {
    await this.ensureInitialized();
    const updateData: any = { status };
    if (transactionId) {
      updateData.transactionId = transactionId;
    }

    const result = await this.givingRecords.findOneAndUpdate(
      { id },
      { $set: updateData },
      { returnDocument: "after" }
    );
    return result ?? undefined;
  }
}