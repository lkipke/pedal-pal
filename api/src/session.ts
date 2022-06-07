import { Router } from 'express';
import MetricData from './database/models/MetricData';
import Session from './database/models/Session';
import sequelize from './database/sequelize';

const router = Router();

router.get('/most_recent', async (req, res, next) => {
  let recentSession = await Session.findOne({
    group: 'id',
    order: [[sequelize.fn('max', sequelize.col('createdAt')), 'DESC']],
  });

  if (recentSession) {
    return res.status(200).json(recentSession.toJSON());
  } else {
    return res.sendStatus(404);
  }
});

router.get('/sessions', async (req, res, next) => {
  let pageOffset = parseInt(req.query.pageOffset as string);
  let pageSize = parseInt(req.query.pageSize as string);
  if (isNaN(pageOffset) || isNaN(pageSize)) {
    return res.status(400).send('pageOffset and pageSize must be specified');
  }

  let sessions = await Session.findAndCountAll({
    offset: pageOffset * pageSize,
    limit: pageSize,
  });

  if (!sessions || !sessions.rows.length) {
    return res.sendStatus(404);
  }

  return res
    .status(200)
    .json({
      sessions: sessions.rows.map((s) => s.toJSON()),
      total: sessions.count
    });
});

router.get('/:id', async (req, res, next) => {
  let session = await Session.findOne({
    group: 'id',
    where: {
      id: req.params.id,
    },
  });

  if (!session) {
    return res.sendStatus(404);
  }

  let metrics = await MetricData.findAll({
    where: {
      SessionId: req.params.id,
    },
  });

  return res.status(200).json({
    session: session.toJSON(),
    data: metrics.map((m) => {
      let json = m.toJSON();
      return {
        ...json,
        time: m.time.getTime(),
      };
    }),
  });
});

router.delete('/:id', async (req, res, next) => {
  await Session.destroy({
    where: {
      id: req.params.id,
    },
  });

  return res.sendStatus(200);
});

router.post('/create', async (req, res, next) => {
  if (!req.body.name) {
    return res.status(400).send('Name must be non-empty string');
  }

  let newSession = await Session.create({
    name: req.body.name,
    UserId: req.user.id,
  });

  return res.status(200).json(newSession.toJSON());
});

export default router;
