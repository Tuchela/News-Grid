import User from "../model/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import nodemailer from "nodemailer";

// register endpoint

export const registerUser = async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;

    //salting / salt round
    const salt = await bcrypt.genSalt(12);
    // hashpassword
    const hashPassword = await bcrypt.hash(password, salt);

    // create new user
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
      message: `${createdUser.firstname} successfully created`,
      createdUser,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

//login endpoint

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
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
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
    if (users.length === 0) {
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
// forgotpassword | otp email verification | otp sms

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate OTP
    const otp = crypto.randomInt(100000, 100000).toString(); // 6 digits
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // Send OTP via email (configure transporter)
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP is ${otp}. It will expire in 10 minutes.`,
    });

    res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// reset password
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Clear OTP
    user.otp = null;
    user.otpExpires = null;

    await user.save();
    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get single user
export const getSingleUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");
    console.log(user);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: `${user.firstname} retrieved successfully`,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

// update user
export const updateUser = async (req, res) => {
  // get user id to update
  const { id } = req.params;
  const { firstname, lastname, email, password } = req.body;

  try {
    // find user by id
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    // hash password before saving
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // update user details
    const userToUpdate = await User.findByIdAndUpdate(
      id,
      {
        firstname: firstname || user.firstname,
        lastname: lastname || user.lastname,
        email: email || user.email,
        password: hashedPassword || user.password,
      },
      { new: true }
    );
    return res.status(200).json({
      message: `${userToUpdate.firstname} updated successfully`,
      userToUpdate,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

// delete user

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    return res.status(200).json({
      message: `${user.firstname} deleted successfully`,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};
