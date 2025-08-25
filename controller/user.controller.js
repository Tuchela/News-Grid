import User from "../model/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

/**
 * register endpoint
 * login endpoint
 * forgotpassword
 * email verification
 * otp
 */

// register endpoint
export const registerUser = async(req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;

    // salting / salt round
    const salt = bcrypt.genSaltSync(12);
    // hashpassword
    const hashPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = await User({
      firstname,
      lastname,
      email,
      password: hashPassword,
    });
    const createdUser = await newUser.save();
    return res.status(201).json({
      message: "User successfully created",
      createdUser,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};
