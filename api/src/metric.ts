import { Router } from 'express';
import MetricData from './database/models/MetricData';

const requiredFieldNames = [
  'speed',
  'cadence',
  'power',
  'time',
] as const;
const optionalFieldNames = ['heartRate', 'calories'] as const;

type Metrics = (Record<typeof requiredFieldNames[number], number> &
  Partial<Record<typeof optionalFieldNames[number], number>>)[];

interface Body {
  data: Metrics;
  session: {
    id: number;
  };
}

const router = Router();
router.post('/', async (req, res, next) => {
  const body = req.body as Body;

  if (!body.session.id) {
    console.error('Missing session id!')
    return res.status(400).send('Missing session id');
  }

  const dataToInsert = body.data
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
        time: data.time,
        speed: data.speed,
        cadence: data.cadence,
        power: data.power,
        SessionId: body.session.id
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
  
  if (!dataToInsert.length && body.data.length) {
    return res.status(400).send('Incorrectly formatted data');
  }

  try {
    await MetricData.bulkCreate(dataToInsert);
  } catch (e) {
    return res.status(500).send({ error: `${e}` });
  }

  return res.sendStatus(200);
});

export default router;
