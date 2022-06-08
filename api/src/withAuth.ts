import { NextFunction, Request, Response } from 'express';
import User from './database/models/User';

const ALLOWED_PATHS = ['/api/login', '/api/oauth_callback']
function withAuth() {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (ALLOWED_PATHS.includes(req.path)) {
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
