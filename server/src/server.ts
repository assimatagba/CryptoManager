import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import config from './assets/config';
import cors from 'cors';
import passport from 'passport';
import https from 'https';
import fs from 'fs';
import session from 'express-session';

// Routes
import cryptoRoute from './database/routes/cryptoRoute';
import articleRoute from './database/routes/articleRoute';
import ArticleCron from "./database/ArticleCron";
import userRoute from './database/routes/userRoutes';

dotenv.config();

const {
  MONGO_HOSTNAME, MONGO_PORT, MONGO_DB, SERVER_PORT, MONGO_USER, MONGO_PASSWORD
} = config;
const mongodbUrl = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}`;
const corsOptions: cors.CorsOptions = {
  credentials: true,
  origin: config.SERVER_URL,
}

mongoose.connect(mongodbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
}).catch((error:any) => console.log(error.reason));

mongoose.connection.once('open', () => {
  console.log('Mongodb Connection Successful');
});

const app = express();

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(session({ secret: 'ThisIsSecret' }));

// Routes
app.use('/api/users', userRoute)
app.use('/api/cryptos', cryptoRoute);
app.use('/api/articles', articleRoute);

https.createServer({
  key: fs.readFileSync(`${__dirname}/assets/certificates/server.key`, 'utf8'),
  cert: fs.readFileSync(`${__dirname}/assets/certificates/server.cert`, 'utf8')
}, app)
.listen(SERVER_PORT, () => {
  console.log(`Server started at https://localhost:${SERVER_PORT}`);
  new ArticleCron();
})
