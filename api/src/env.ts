import dotenv from 'dotenv';
const isDev = process.env.NODE_ENV === 'development';
dotenv.config({ path: isDev ? '../.env.dev' : '../.env' });
