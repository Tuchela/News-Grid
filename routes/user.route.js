import express from "express";
import {
  deleteUser,
  forgotPassword,
  getAllUsers,
  getSingleUser,
  loginUser,
  registerUser,
  resetPassword,
  updateUser,
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
router.get("/:id", getSingleUser);
// update user endpoint
router.put("/:id", updateUser);
// delete user endpoint
router.delete("/:id", deleteUser);


export default router;
