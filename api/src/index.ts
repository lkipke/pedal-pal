import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import initDatabase from './database/init';
import login from './login';
import user from './user';
import withAuth from './withAuth';

initDatabase().then(() => {
  console.log('======== database initialized!');
  createServer();
});

const createServer = () => {
  const port = process.env.NODE_DOCKER_PORT;

  const allowList: string[] = JSON.parse(process.env.CLIENT_ORIGIN_ALLOW_LIST);
  const corsOptions: cors.CorsOptions = {
    origin: allowList,
  };

  const app = express();
  app.use(cookieParser(process.env.NODE_COOKIE_SECRET));
  app.use(cors(corsOptions));
  app.use(withAuth());

  app.use('/api/login', login);
  app.use('/api/user', user);

  app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
  });

  app.get('/api', (req: Request, res: Response) => {
    res.send('API: Hello World!');
  });

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
};
