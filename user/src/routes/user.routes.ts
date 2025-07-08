import express, { Router} from 'express';
import { signup,signin,logout,getProfile } from '../controllers/user.controller';
import auth from '../middlewares/auth';

const router: Router = express.Router();

router.post('/signup',signup);
router.post('/signin', signin);
router.get('/logout',logout);

router.use(auth);

router.get('/profile', getProfile);

export default router;