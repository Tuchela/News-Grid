import express from "express";
import dotenv from "dotenv";
import { connectToDatabase } from "./databaseConnection/connection.js";
import UserRoute from "./routes/user.route.js";
import morgan from "morgan";
import cors from "cors";

dotenv.config()

const app = express();

// parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// loggers
app.use(morgan("dev"));

const PORT = process.env.PORT || 2025;
// cors
app.use(cors())
// connection
connectToDatabase();
app.get("/", (req, res) => {
  res.send("Hola mi MONGODB");
});

// users route
app.use("/api/v1/user", UserRoute);

app.listen(PORT, () => {
  console.log(`sever is running on port ${PORT}`);
});
