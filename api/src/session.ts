import { Router } from 'express';
import sequelize from './database/sequelize';
import Session from './database/models/Session';

const router = Router();

router.get('/most_recent', async (req, res, next) => {
  let recentSession = await Session.findOne({
    group: 'id',
    order: [[sequelize.fn('max', sequelize.col('createdAt')), 'DESC']]
  });

  if (recentSession) {
    return res.status(200).json(recentSession.toJSON());
  } else {
    return res.sendStatus(404);
  }
});

router.post('/create', async (req, res, next) => {
  if (!req.body.name) {
    return res.status(400).send('Name must be non-empty string');
  }

  let newSession = await Session.create({
    name: req.body.name,
    UserId: req.user.id
  });

  return res.status(200).json(newSession.toJSON());
});

export default router;
