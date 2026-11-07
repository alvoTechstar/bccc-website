"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDb = connectToDb;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables if not already loaded by index.ts
dotenv_1.default.config();
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
    console.error("MONGO_URI environment variable is not set.");
    process.exit(1);
}
// Returns native Db (typed as any to avoid version mismatch between
// `mongodb` and mongoose's bundled `mongodb` types).
async function connectToDb() {
    try {
        await mongoose_1.default.connect(MONGO_URI);
        const db = mongoose_1.default.connection.db;
        if (!db) {
            throw new Error("mongoose.connection.db is undefined after connect");
        }
        console.log("Connected to MongoDB successfully using Mongoose.");
        return db; // Return the Db object
    }
    catch (error) {
        console.error("Could not connect to MongoDB:", error);
        throw error;
    }
}
// Optional: Handle disconnection events
mongoose_1.default.connection.on('disconnected', () => {
    console.log('MongoDB disconnected.');
});
mongoose_1.default.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});
