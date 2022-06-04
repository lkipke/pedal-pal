import { Router } from 'express';
import MetricData from './database/models/MetricData';

const requiredFieldNames = [
  'speed',
  'cadence',
  'power',
  'timestamp',
  'sessionId',
] as const;

interface Metric extends Record<typeof requiredFieldNames[number], number> {
  heartRate?: number;
  calories?: number;
}

const router = Router();
router.post('/', async (req, res, next) => {
  const body = req.body as Metric[];

  const dataToInsert = body
    .map((data) => {
      const keys = Object.keys(data);
      const missingFieldNames = requiredFieldNames.filter(
        (name) => !keys.includes(name)
      );
      if (missingFieldNames.length) {
        console.error('Missing fields!', missingFieldNames);
        return null;
      }

      let insertFields: Record<string, number> = {
        timestamp: data.timestamp,
        speed: data.speed,
        cadence: data.cadence,
        power: data.power,
        SessionId: data.sessionId,
      };
      if (data.heartRate) {
        insertFields['heartRate'] = data.heartRate;
      }

      if (data.calories) {
        insertFields['calories'] = data.calories;
      }

      return insertFields;
    })
    .filter((data) => !!data) as Record<string, number>[];

  try {
    await MetricData.bulkCreate(dataToInsert);
  } catch (e) {
    return res.status(500).send({ error: `${e}` });
  }

  return res.sendStatus(200);
});

export default router;
