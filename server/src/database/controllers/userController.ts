import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import passport from 'passport';
import strategy from "passport-facebook";
import { authJwt, UserRequest } from '../middlewares/authJwtMiddleware';
import config from "../../assets/config";

import { UserModel } from '../models/userModel'

const FacebookStrategy = strategy.Strategy;
const { FACEBOOK } = config;

enum Provider {
  FACEBOOK = 'facebook',
  LOGIN = 'login'
}

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserModel.findById(id)
    return done(null, user);
  } catch (error) {
    return done(error);
  }
});

passport.use(
  new FacebookStrategy(
    {
      clientID: FACEBOOK.CLIENT_ID,
      clientSecret: FACEBOOK.CLIENT_SECRET,
      callbackURL: FACEBOOK.CALLBACK_URL,
      profileFields: ["emails", "name", "id", "displayName", "picture.type(large)"]
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const user = await UserModel.findOne({ 'provider_id': profile.id });
        if (user) {
          return done(null, user);
        } else {
          const newUser = new UserModel({
            provider: Provider.FACEBOOK,
            provider_id: profile.id,
            username: profile.name?.givenName,
            email: profile.emails ? profile.emails[0].value : null,
          });
          newUser.provider_token = authJwt.createToken(newUser);
          await newUser.save();
          return done(null, newUser);
        }
      } catch (error) {
        return done(error);
      }
    }
  )
);

const registerUser = async (req: Request, res: Response) => {
  const user = new UserModel({
    provider: Provider.LOGIN,
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  });
  try {
    const newUser = await user.save();
    res.send({
      status: 'ok',
      data:{
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
        token: authJwt.createToken(newUser)
      }
    });
  } catch (error) {
    res.status(500).send({ status: 'ko', message: error.message });
  }
}

const loginUser = async (req: Request, res: Response) => {
  try {
    const user = await UserModel.findOne({
      email: req.body.email
    });
    if (!user) {
      return res.status(404).send({ status: 'ko', message: 'User Not found.' })
    }
    if (user.password === undefined || !user.password) {
      return res.status(401).send({ status: 'ko', message: 'Use Facebook login instead, or create an account' });
    }
    const isPasswordValid = bcrypt.compareSync(req.body.password, user.password)
    if (!isPasswordValid) {
      return res.status(401).send({ status: 'ko', token: null, message: 'Invalid Password!' });
    }
    return res.status(200).send({
      status: 'ok',
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        token: authJwt.createToken(user)
      }
    })
  } catch (error) {
    return res.status(500).send({ status: 'ko', message: error.message })
  }
}

const updateUser = async (req: UserRequest, res: Response) => {
  try {
    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(404).send({ status: 'ko', message: 'User not found' })
    }
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = bcrypt.hashSync(req.body.password, 8)
    }
    const updatedUser = await user.save();
    return res.send({
      id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
    })
  } catch (error) {
    return res.status(500).send({ status: 'ko', message: error.message })
  }
}

const getUserProfile = async (req: UserRequest, res: Response) => {
  try {
    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(404).send({ status: 'ko', message: 'User not found' });
    }
    return res.status(200).send({
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
      }
    })
  } catch (error) {
    return res.status(500).send({ status: 'ko', message: error.message })
  }
}

const fbCallback = async (req: UserRequest, res: Response) => {
  res.redirect(200, `http://localhost:3000/login/facebook?jwt=${req.user.provider_token}`);
}

export const userController = {
  registerUser,
  loginUser,
  updateUser,
  getUserProfile,
  fbCallback
};
