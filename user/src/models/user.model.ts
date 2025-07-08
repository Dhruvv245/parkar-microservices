import mongoose, { Schema } from "mongoose";
import { isEmail } from "validator";
import bcrypt from "bcryptjs";
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

userSchema.pre(`save`, async function (next) {
  if (!this.isModified(`password`)) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword:string,
  userPassword:string
):Promise<boolean> {
  return await bcrypt.compare(candidatePassword, userPassword);
};

export const User = mongoose.model<IUser>("User", userSchema);
