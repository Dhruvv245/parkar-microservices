import dotenv from "dotenv";
import express, { Express } from "express";
import cookieParser from "cookie-parser";
import userRouter from './routes/user.routes';

dotenv.config({path:'./config.env'});
const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/user',userRouter);

export default app;
