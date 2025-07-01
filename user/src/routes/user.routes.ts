import express, { Router, Request, Response } from 'express';
import { signup } from '../controllers/user.controller';

const router: Router = express.Router();

router.post('/signup',signup);

export default router;