// import './env';
import express, { Request, Response } from "express";
import cors from "cors";
import initDatabase from "./database/init";

console.log("======== initializing database");
initDatabase().then(() => {
  console.log("======== database initialized!");
  createServer();
});

const createServer = () => {
  const port = process.env.NODE_DOCKER_PORT;
  const corsOptions = {
    origin: process.env.CLIENT_ORIGIN,
  };

  const app = express();
  app.use(cors(corsOptions));

  app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!");
  });

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
};
