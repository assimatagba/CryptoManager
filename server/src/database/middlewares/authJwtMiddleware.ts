import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import storage from "node-persist";
import config from '../../assets/config';
import { User, UserModel } from '../models/userModel';

storage.init().then().catch();

export interface UserRequest extends Request {
  user: User
}

const createToken = (user: User) => {
  const token = jwt.sign({
    id: user._id,
    provider: user.provider,
    isAdmin: user.isAdmin
  }, config.JWT_SECRET, { expiresIn: '48h' });

  return token
}

const verifyToken = async (req: UserRequest, res: Response, next: NextFunction) => {
  const bearerToken = req.headers.authorization || '';
  const onlyToken = bearerToken.slice(7, bearerToken.length);
  const blacklist:string[] = await storage.getItem("blacklist");

  if (!bearerToken) {
    res.status(403).send({ message: "No token provided." });
    return;
  }
  if (blacklist && blacklist.includes(bearerToken)) {
    res.status(401).send({ message: "User is logged out."});
    return;
  }
  jwt.verify(onlyToken, config.JWT_SECRET, (err, decoded: any) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized !" });
    }
    req.user = decoded;
    return next();
  })
}

const isAdmin = (req: UserRequest, res: Response, next: NextFunction) => {
  verifyToken(req, res, () => {
    UserModel.findById(req.user.id).exec((error, user) => {
      if (error) {
        res.status(500).send({ status: "ko", message: error.message })
        return
      }
      if (user && user.isAdmin) {
        next();
        return
      }
      res.status(403).send({ message: "Require admin role" });
    })
  })
}

const logout = async (req: UserRequest, res: Response) => {
  const bearerToken = req.headers.authorization || '';
  const blacklist:string[] = await storage.getItem("blacklist") || [];

  if (!bearerToken) {
    return res.status(403).send({ status: 'ko', message: 'No token provided' })
  }
  if (blacklist.includes(bearerToken)) {
    return res.status(403).send({ status: 'ko', message: "User is already logged out." });
  }
  blacklist.push(bearerToken);
  await storage.setItem("blacklist", blacklist);
  return res.status(204);
}

export const authJwt = {
  createToken,
  verifyToken,
  isAdmin,
  logout
}
