import dotenv from "dotenv";
import express from "express";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";
import root from "./routes/root.ts";
import { logger, logEvents } from "./middleware/logger.ts";
import errorHandler from "./middleware/errorHandler.ts";
import cookieParser from "cookie-parser";
import corsOptions from "./config/corsOptions.ts";
import connectDB from "./config/dbConn.ts";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes.ts";
import noteRoutes from "./routes/noteRoutes.ts";

dotenv.config();

console.log("process.env.NODE_ENV: ", process.env.NODE_ENV);

connectDB();

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const app = express();

const PORT = process.env.PORT || 3500;

// Middleware:

app.use(logger);

app.use("/", express.static(path.join(__dirname, "public")));

app.use(cors(corsOptions));

app.use(express.json());

// Error handler for JSON parsing errors
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    if (err instanceof SyntaxError && "body" in err) {
      return res.status(400).json({ message: "Invalid JSON in request body" });
    }
    next(err);
  },
);

app.use(cookieParser());

// Routes:
app.use("/", root);

app.use("/users", userRoutes);

app.use("/notes", noteRoutes);

// 404 handler:
app.use((req: express.Request, res: express.Response) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views/404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);

// Start the server
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB, starting server...");

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error: ", err);

  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoErrLog.log",
  );
});
