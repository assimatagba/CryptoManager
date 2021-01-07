const config = {
  MONGO_HOSTNAME: process.env.MONGO_HOSTNAME || 'localhost',
  MONGO_DB: process.env.MONGO_DB || 'TheCountOfMoney',
  MONGO_PORT: process.env.MONGO_PORT || '27017',
  MONGO_USER: process.env.MONGO_USER || 'user',
  MONGO_PASSWORD: process.env.MONGO_PASSWORD || 'user06',
  SERVER_PORT: process.env.SERVER_PORT || '5000',
  SERVER_URL: process.env.SERVER_URL || 'https://127.0.0.1:5000',
  JWT_SECRET: process.env.JWT_SECRET || 'LAMMAL',
  FACEBOOK: {
    CLIENT_ID: process.env.FACEBOOK_CLIENT_ID || '1234',
    CLIENT_SECRET: process.env.FACEBOOK_SECRET || '1234',
    CALLBACK_URL: process.env.FACEBOOK_CALLBACK_URL || 'https://localhost:5000/api/users/auth/facebook/callback',
  }
};

export default config;
