import express from "express";
import { registerUser } from "../controller/user.controller.js";

// initialize router

const router = express.Router();

// register route
router.post("/create-user", registerUser)

export default router;
