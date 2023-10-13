import express from 'express';
// controller functions
import { signinUser, signupUser } from '../controllers/userController.js';

const userRouter= express.Router();

//signin router
userRouter.post('/signin',signinUser)

//signup router
userRouter.post('/signup',signupUser)

export default userRouter;