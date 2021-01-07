import mongoose from 'mongoose';
import uniqueValidator from "mongoose-unique-validator";

export interface User extends mongoose.Document {
  provider: string;
  provider_id: string;
  provider_token: string;
  username: string;
  email: string;
  password: string;
  isAdmin: boolean;
  userID: string;
}

const userSchema = new mongoose.Schema({
  provider: {
    type: String,
    required: true,
    enum: ['login', 'facebook'],
    default: 'login'
  },
  provider_id: {
    type: String,
    unique: true
  },
  provider_token: {
    type: String,
    unique: true,
  },
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  }
});

userSchema.plugin(uniqueValidator);

const UserModel = mongoose.model<User>('User', userSchema)

export { UserModel };
