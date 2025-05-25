import express from "express";
import notesRoutes from "./routes/notesRoutes.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import rateLimiter from "./middleware/rateLimiter.js";
import cors from "cors";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve(); // dir path of "backend" dir

// In dev, we use 2 domains backend and frontend. In prod, we only have 1 for both.
if (process.env.NODE_ENV !== "production") {
  // this cors middleware must be before rateLimiter middleware because we want cors to be set up before rateLimiter sends rate limit response back to client
  app.use(cors({ origin: ["http://localhost:5173"] }));
}

// we use ".use" to add a middleware
// middleware that allows us to get access to the json body of the request
app.use(
  express.json() // pares JSON body
);

app.use(rateLimiter);

// simple custom middleware
// app.use((req, res, next) => {
//   console.log(`Req method is ${req.method} & Req URL is ${req.url}`);

//   next(); // after intercepting the req and doing something, we forward the req
// });

app.use("/api/notes", notesRoutes);

if (process.env.NODE_ENV === "production") {
  // specify the path of the frontend folder
  // This means serve our built (optimized) react app as a static asset
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  // if we get a request to anything other than "/api/notes" specified above, then we serve our react app
  app.get("*", (req, res) => {
    // serve the starting point of our react app, the index.html file
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

await connectDB(); // finish connecting to db successfully before running the server
app.listen(PORT, () => {
  console.log(`Server started on PORT: ${PORT}`);
});
