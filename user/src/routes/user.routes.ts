import express, { Router, Request, Response } from 'express';

const router: Router = express.Router();

router.route('/').get((req: Request, res: Response) => {
  res.json({ message: 'User route working!' });
});

export default router;