import express from "express";
import {
  getAllUsers,
  loginUser,
  registerUser,
  forgotPassword,
} from "../controller/user.controller.js";

// initialize router

const router = express.Router();

// register route
router.post("/create-user", registerUser);
// login route
router.post("/login", loginUser);
// all user endpoint
router.get("/users", getAllUsers);
// forgot password
router.post("/forgot-password", forgotPassword);

export default router;
