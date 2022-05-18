import './env';
import express, { Request, Response } from 'express';
import cors from 'cors';

import controller from './database/controller';

const port = process.env.NODE_DOCKER_PORT!;
const corsOptions = {
    origin: process.env.CLIENT_ORIGIN!,
};

const app = express();
app.use(cors(corsOptions));

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
