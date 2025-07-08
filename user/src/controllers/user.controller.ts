import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import config from '../config';
import { User as IUser } from '../types';
import { User } from '../models/user.model';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';

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

export const signup =  catchAsync(async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
    createSendToken(newUser, 201, res);
  }
);

export const signin = catchAsync(async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
  const { email, password } = req.body;
   if (!email || !password) {
    return next(new AppError(`Please provide your email and password`, 400));
  }
  const user = await User.findOne({email}).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError(`Incorrect email or password`, 401));
  }
  createSendToken(user, 200, res);
})

export const logout = (req: Request, res: Response): void => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    secure: config.NODE_ENV === 'production',
  });
  
  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully',
  });
}

export const getProfile = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  if (!req.user) {
    return next(new AppError('You are not logged in', 401));
  }
  const user = await User.findById(req.user.id).select('-password');
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});