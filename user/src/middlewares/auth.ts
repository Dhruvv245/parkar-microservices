import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import jwt from "jsonwebtoken";
import config from "../config";
import { User } from "../models/user.model";
import { User as IUser } from "../types";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

const auth = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  let token: string = "";
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token || token.split(".").length !== 3) {
    return next(
      new AppError("You are not logged in! Please log in to get access", 401)
    );
  }
  const secret = config.JWT_SECRET;
  if (!secret) {
    return next(new AppError("JWT secret not configured", 500));
  }
  
  let decoded: { id: string };
  try {
    decoded = jwt.verify(token, secret) as { id: string };
  } catch (error) {
    return next(new AppError("Invalid token. Please log in again", 401));
  }
  
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError("The user with this token doesn't exist", 401));
  }
  
  req.user = currentUser;
  next();
});

export default auth;