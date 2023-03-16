import express from 'express';
import { register, login, logout, refresh, getAllUsers } from '../controllers/userController';
import authMiddleware from '../middlewares/authMiddleware';

const userRouter = express.Router();
userRouter.route('/').get(authMiddleware, getAllUsers);
userRouter.route('/signup').post(register);
userRouter.route('/login').post(login);
userRouter.route('/logout').get(logout);
userRouter.route('/refresh').get(refresh);


export { userRouter };