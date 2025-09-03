import express from "express";
import {
  resetPassword,
  getSingleUser,
  updateUser,
  deleteUser,
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
// reset password
router.post("/reset-password", resetPassword);
// single user endpoint
router.get("/user/:id", getSingleUser);
// update user endpoint
router.put("/user/:id", updateUser);
// delete user endpoint
router.delete("/user/:id", deleteUser);


export default router;
