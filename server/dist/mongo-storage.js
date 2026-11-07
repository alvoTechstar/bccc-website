"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoStorage = void 0;
const db_1 = require("./db"); // Assuming this correctly returns a Promise<Db>
const crypto_1 = require("crypto");
class MongoStorage {
    constructor() {
        this.initialized = false;
        this.initializationPromise = null; // To prevent multiple concurrent initializations
        // We don't initialize directly in the constructor to avoid sync/async issues.
        // Instead, methods will call ensureInitialized.
    }
    async initialize() {
        if (!this.initialized) {
            try {
                this.db = await (0, db_1.connectToDb)(); // Ensure connectToDb() returns a valid Db object
                if (!this.db) {
                    throw new Error("Failed to connect to the database: connectToDb() returned undefined.");
                }
                this.users = this.db.collection("users");
                this.blogPosts = this.db.collection("blogPosts");
                this.contactMessages = this.db.collection("contactMessages");
                this.givingRecords = this.db.collection("givingRecords");
                this.initialized = true;
            }
            catch (error) {
                console.error("Error during storage initialization:", error);
                // Re-throw the error to be caught by the caller of ensureInitialized
                throw error;
            }
        }
    }
    async ensureInitialized() {
        if (!this.initialized) {
            // If initialization is already in progress, wait for it.
            if (!this.initializationPromise) {
                this.initializationPromise = this.initialize();
            }
            await this.initializationPromise;
        }
    }
    // --- Methods using ensureInitialized ---
    async getUser(id) {
        await this.ensureInitialized();
        const user = await this.users.findOne({ id });
        return user ?? undefined;
    }
    async getUserByUsername(username) {
        await this.ensureInitialized();
        const user = await this.users.findOne({ username });
        return user ?? undefined;
    }
    async createUser(user) {
        await this.ensureInitialized();
        const newUser = {
            ...user,
            id: (0, crypto_1.randomUUID)()
        };
        await this.users.insertOne(newUser);
        return newUser;
    }
    async getBlogPosts(limit) {
        await this.ensureInitialized();
        const cursor = this.blogPosts.find();
        if (limit && limit > 0) {
            cursor.limit(limit);
        }
        return await cursor.toArray();
    }
    async getBlogPost(id) {
        await this.ensureInitialized();
        const post = await this.blogPosts.findOne({ id });
        return post ?? undefined;
    }
    async createBlogPost(post) {
        await this.ensureInitialized();
        const newPost = {
            ...post,
            id: (0, crypto_1.randomUUID)(),
            createdAt: new Date(),
            updatedAt: new Date()
        };
        await this.blogPosts.insertOne(newPost);
        return newPost;
    }
    async getBlogPostsByCategory(category) {
        await this.ensureInitialized();
        return await this.blogPosts.find({ category }).toArray();
    }
    async createContactMessage(message) {
        await this.ensureInitialized();
        const newMessage = {
            ...message,
            id: (0, crypto_1.randomUUID)(),
            createdAt: new Date()
        };
        await this.contactMessages.insertOne(newMessage);
        return newMessage;
    }
    async getContactMessages() {
        await this.ensureInitialized();
        return await this.contactMessages.find().toArray();
    }
    async createGivingRecord(record) {
        await this.ensureInitialized();
        const newRecord = {
            ...record,
            id: (0, crypto_1.randomUUID)(),
            createdAt: new Date(),
            status: "pending"
        };
        await this.givingRecords.insertOne(newRecord);
        return newRecord;
    }
    async getGivingRecords() {
        await this.ensureInitialized();
        return await this.givingRecords.find().toArray();
    }
    async getGivingRecord(id) {
        await this.ensureInitialized();
        const record = await this.givingRecords.findOne({ id });
        return record ?? undefined;
    }
    async updateGivingRecordStatus(id, status, transactionId) {
        await this.ensureInitialized();
        const updateData = { status };
        if (transactionId) {
            updateData.transactionId = transactionId;
        }
        const result = await this.givingRecords.findOneAndUpdate({ id }, { $set: updateData }, { returnDocument: "after" });
        return result ?? undefined;
    }
}
exports.MongoStorage = MongoStorage;
