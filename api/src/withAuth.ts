import { NextFunction, Request, Response } from 'express';
import User from './database/models/User';

function withAuth() {
  return async (req: Request, res: Response, next: NextFunction) => {
    console.log('REQ PATH', req.path);
    if (req.path === '/api/login') {
      return next();
    }

    console.log('cookies', req.cookies);
    console.log('signed', req.signedCookies);
    let user: User | null = null;
    if (req.signedCookies.AuthToken) {
      user = await User.findOne({
        where: {
          authToken: req.signedCookies.AuthToken,
        },
      });
    }

    if (!user) {
      return res.status(401).send();
    }

    (req as any).user = user;
  };
}

export default withAuth;
