import express from "express";
import notesRoutes from "./routes/notesRoutes.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import rateLimiter from "./middleware/rateLimiter.js";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// this cors middleware must be before rateLimiter middleware because we want cors to be set up before rateLimiter sends rate limit response back to client
app.use(cors({ origin: ["http://localhost:5173"] }));

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

await connectDB(); // finish connecting to db successfully before running the server
app.listen(PORT, () => {
  console.log(`Server started on PORT: ${PORT}`);
});
