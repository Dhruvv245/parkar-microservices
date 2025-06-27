import express, { Express} from "express";
import userRouter from './routes/user.routes';

const app: Express = express();

app.use('/user',userRouter);

export default app;
