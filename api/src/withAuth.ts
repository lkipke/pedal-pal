import { NextFunction, Request, Response } from 'express';
import User from './database/models/User';

function withAuth() {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (req.path === '/api/login') {
      return next();
    }

    let user: User | null = null;
    let authToken = req.signedCookies.AuthToken;
    if (authToken) {
      user = await User.findOne({
        where: {
          authToken,
        },
      });
    }

    if (!user) {
      return res.status(401).send();
    }

    (req as any).user = user;
    return next();
  };
}

export default withAuth;
