"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = require("./routes"); // Assuming you have this
const db_1 = require("./db");
const logger_1 = require("./logger"); // Assuming you have this
// Load environment variables FIRST
dotenv_1.default.config();
const app = (0, express_1.default)();
// Enable CORS for requests from the Vite client
app.use((0, cors_1.default)({
    origin: "http://localhost:5173", // Default Vite port
    credentials: true,
}));
const PORT = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
// --- Add this simple root route ---
app.get("/", (req, res) => {
    res.send("<h1>Server is Running!</h1><p>This is a confirmation message.</p>");
});
// --- End of added route ---
// Logging middleware (simplified)
app.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => {
        const duration = Date.now() - start;
        if (req.path.startsWith("/api")) {
            // Assuming 'log' is a function that handles your logging
            (0, logger_1.log)(`${req.method} ${req.path} ${res.statusCode} in ${duration}ms`);
        }
    });
    next();
});
// Register your API routes
(0, routes_1.registerRoutes)(app);
// --- IMPORTANT: Connection logic ---
async function startServer() {
    try {
        await (0, db_1.connectToDb)(); // Connect to MongoDB using Mongoose
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1); // Exit the process if the database connection fails
    }
}
startServer();
