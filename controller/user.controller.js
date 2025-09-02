import User from "../model/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";

/**
 * register endpoint
 * login endpoint
 * reset password
 * email verification
 * otp
 */

// register endpoint

export const registerUser = async (req, res) => {
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
    // find if user already exist
    const user = await User.findOne({ email });
    if (user) {
      return res.status(401).send("User already exist");
    }
    const createdUser = await newUser.save();
    return res.status(201).json({
      message: `${createdUser.firstname} your account has been created successfully`,
      createdUser,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

// Login endpoint
export const loginUser = async (req, res) => {
  try {
    // email and password
    const { email } = req.body;
    // check if user exist
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User does not exist",
      });
    }
    // Check if password match
    const checkIfPasswordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );
    // if does not match
    if (!checkIfPasswordMatch) {
      return res.status(401).json({
        message: "Invalid User credentials",
      });
    }
    // generate token
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET
    );
    // omit password
    const { password, ...otherUserData } = user._doc;
    return res.status(200).json({
      message: "User successfully logged in",
      otherUserData,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

// get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (users.lenght === 0) {
      return res.status(404).json({
        message: "No user found",
      });
    }
    return res.status(200).json({
      message: "Users retrieved successfully",
      users,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// forgot password

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // 1. Find user email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User does not exist",
      });
    }
    // 2. Generate OTP (6-digit)
    const otp = crypto.randomInt(100000, 999999).toString();

    // 3. Set OTP expiration (10 minutes)
    user.otp = otp;
    user.otpExpire = Date.now() + 10 * 60 * 1000;
    await user.save();

    // 4. Send OTP email
    await sendEmail({
      to: user.email,
      subject: "Password Reset OTP",
      text: ` Your OTP for password reset is ${otp}. It is valid for 2 minutes.`,
      html: `
        <div style="font-family:Arial, sans-serif; line-height:1.6;">
          <h3>Password Reset OTP</h3>
          <p>Your OTP is:</p>
          <h2 style="color:#007bff;">${otp}</h2>
          <p>This code is valid for <b>10 minutes</b>. Do not share it with anyone.</p>
        </div>
      `,
    });

    // 5 response
    return res.status(200).json({
      message: "OTP sent to email",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
