import dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const SERVER_PORT = process.env.SERVER_PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || '';
const MONGO_USERNAME = process.env.MONGO_USERNAME || 'root';
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || 'test';
const MONGO_CLUSTER = process.env.MONGO_CLUSTER || 'test';
const ACCESS_TOKEN_SECRET_KEY = process.env.ACCESS_TOKEN_SECRET_KEY || '';
const REFRESH_TOKEN_SECRET_KEY = process.env.REFRESH_TOKEN_SECRET_KEY || '';

export const config = {
  jwt: {
    access: ACCESS_TOKEN_SECRET_KEY,
    refresh: REFRESH_TOKEN_SECRET_KEY,
  },
  server: {
    port: SERVER_PORT,
    env: NODE_ENV
  },
  mongo: {
    cluster: MONGO_CLUSTER,
    user: MONGO_USERNAME,
    password: MONGO_PASSWORD
  },
};
