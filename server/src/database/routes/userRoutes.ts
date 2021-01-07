import express from 'express';
import passport from 'passport';
import { userController } from '../controllers/userController';
import { authJwt } from '../middlewares/authJwtMiddleware';

const userRoute = express.Router();

userRoute.post('/register', userController.registerUser);
userRoute.post('/login', userController.loginUser);
userRoute.get('/profile', authJwt.verifyToken as any, userController.getUserProfile as any);
userRoute.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));
userRoute.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/', session: false }), userController.fbCallback as any);
userRoute.post('/logout', authJwt.logout as any);
userRoute.put('/profile', authJwt.verifyToken as any, userController.updateUser as any);

export default userRoute;
