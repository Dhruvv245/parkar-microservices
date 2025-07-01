import mongoose, { Schema } from "mongoose";
import { isEmail } from "validator";
import { User as IUser } from "../types";

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Provide your name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Provide your email"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: [isEmail, "Provide a valid email"],
    },
    password: {
      type: String,
      required: [true, `Please enter a password`],
      minlength: [8, `Password must at least have 8 characters`],
      select: false,
    },
  },
  {
    timestamps: true, 
  }
);

export const User = mongoose.model<IUser>("User", userSchema);
