import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

export interface ArticleDocument extends mongoose.Document
{
  title:string;
  url:string;
  imageUrls:string[];
  source:string;
  publishedAt:Date;
  categories:string[];
  content:string|undefined;
}

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true,
    unique: true
  },
  imageUrls: {
    type: Array,
    default: []
  },
  source: {
    type: String,
    required: true
  },
  publishedAt: {
    type: Date,
    required: true
  },
  categories: {
    type: Array,
    default: []
  },
  content: {
    type: String
  }
});

articleSchema.plugin(uniqueValidator);

export default mongoose.model<ArticleDocument>('Article', articleSchema);