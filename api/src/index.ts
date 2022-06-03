import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import initDatabase from './database/init';
import login from './login';
import logout from './logout';
import metric from './metric';
import user from './user';
import session from './session';
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
    credentials: true,
  };

  const app = express();
  app.use(cookieParser(process.env.NODE_COOKIE_SECRET));
  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(withAuth());

  app.use('/api/login', login);
  app.use('/api/logout', logout);
  app.use('/api/user', user);
  app.use('/api/session', session);
  app.use('/api/metric', metric);

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
