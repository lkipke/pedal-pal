import { Request, Router } from 'express';
import User from './database/models/User';

const router = Router();
router.use('/', async (req, res, next) => {
  console.log('HERE IN API', req.user?.toJSON());
  if (!req.user) {
    return res.sendStatus(401);
  } else {
    return res.status(200).json(req.user.toJSON());
  }
});

export default router;
