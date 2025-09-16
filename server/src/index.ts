import dotenv from "dotenv";
import express, { type Request, Response, NextFunction } from "express";
import cors from "cors";
import { registerRoutes } from "./routes"; // Assuming you have this
import { connectToDb } from "./db";
import { log } from "./logger"; // Assuming you have this

// Load environment variables FIRST
dotenv.config();

const app = express();

// Enable CORS for requests from the Vite client
app.use(cors({
  origin: "http://localhost:5173", // Default Vite port
  credentials: true,
}));
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// --- Add this simple root route ---
app.get("/", (req: Request, res: Response) => {
  res.send("<h1>Server is Running!</h1><p>This is a confirmation message.</p>");
});
// --- End of added route ---


// Logging middleware (simplified)
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (req.path.startsWith("/api")) {
      // Assuming 'log' is a function that handles your logging
      log(`${req.method} ${req.path} ${res.statusCode} in ${duration}ms`);
    }
  });
  next();
});

// Register your API routes
registerRoutes(app);

// --- IMPORTANT: Connection logic ---
async function startServer() {
  try {
    await connectToDb(); // Connect to MongoDB using Mongoose
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1); // Exit the process if the database connection fails
  }
}

startServer();