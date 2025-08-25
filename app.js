import express from "express";
import dotenv from "dotenv";
import { connectToDatabase } from "./databaseConnection/connection.js";
import UserRoute from "./routes/user.route.js";

dotenv.config();

const app = express();

// parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 2025;

// connection
connectToDatabase();
app.get("/", (req, res) => {
  res.send("sever is working fine");
});

// users route
app.use("/api/v1/user", UserRoute);

app.listen(PORT, () => {
  console.log(`sever is running on port ${PORT}`);
});
