import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

export interface CryptoDocument extends mongoose.Document
{
  code:string;
  name:string;
}

const cryptoSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    unique: true
  }
});

cryptoSchema.plugin(uniqueValidator);

export default mongoose.model<CryptoDocument>('Crypto', cryptoSchema);