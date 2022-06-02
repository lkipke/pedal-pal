import { Router } from 'express';
import User from './database/models/User';

const router = Router();
router.post('/', async (req, res, next) => {
  User.update(
    {
      authToken: null,
    },
    {
      where: {
        username: req.user.username,
      },
    }
  );

  res.clearCookie('AuthToken');
  return res.sendStatus(200);
});

export default router;
