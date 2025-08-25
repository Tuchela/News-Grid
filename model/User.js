import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    firstname: {
      type: String,
      min: 3,
      max: 30,
      required: true,
    },
    lastname: {
      type: String,
      min: 3,
      max: 30,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      min: 8,
      max: 25,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const user = mongoose.model("user", userSchema);
export default user;
