import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import config from '../config';
import { User as IUser } from '../types';
import { User } from '../models/user.model';

const signToken = (id: string): string => {
  const secret = config.JWT_SECRET;
  const expiresIn = config.JWT_EXPIRES_IN ;

  if (!secret) {
    throw new Error('❌ JWT_SECRET is not defined in environment variables');
  }

  return jwt.sign({ id }, secret as jwt.Secret, {
    expiresIn: expiresIn as jwt.SignOptions['expiresIn'],
  });
};

const createSendToken = (user: IUser, statusCode: number, res: Response): void => {
  const token = signToken(user.id.toString());
  const expiresIn: number = parseInt(config.JWT_COOKIE_EXPIRES_IN || '7', 10);
  
  const cookieOptions = {
    expires: new Date(
      Date.now() + expiresIn * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: config.NODE_ENV === 'production',
  };
  
  res.cookie('jwt', token, cookieOptions);

  const userResponse = { ...user.toObject() };
  delete userResponse.password;
  
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user: userResponse,
    },
  });
};

export const signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
    createSendToken(newUser, 201, res);
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Something went wrong during signup',
    });
  }
};