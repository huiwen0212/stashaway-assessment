import express, { Express, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import HttpStatus from "http-status-codes";

import http from "http";
import DepositRouter from "./routes/deposit.route";
import "../src/db/db.module";
import { Logger } from "../src/lib/logger";

const app: Express = express();

dotenv.config();
const port = process.env.PORT;

/** Logging */
app.use(morgan("dev"));
/** Parse the request */
app.use(express.urlencoded({ extended: false }));
/** Takes care of JSON data */
app.use(express.json());

/** Routes */
app.use("/deposit", DepositRouter);

/** Error handling */
app.use((req, res, next) => {
  const error = new Error("not found");
  return res.status(404).json({
    message: error.message,
  });
});
app.use((req: Request, res: Response, next: NextFunction) => {
  const error: any = new Error("Not Found");
  error.status = HttpStatus.NOT_FOUND;
  next(error);
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || HttpStatus.INTERNAL_SERVER_ERROR);

  if (!err.status || err.status == HttpStatus.INTERNAL_SERVER_ERROR) {
    Logger.error(`error: ${err.message}`);
  } else {
    Logger.info(`info: ${err.message}`);
  }

  return res.send({
    message: err.message,
  });
});

/** Server */
const server = app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

export { app, server };
