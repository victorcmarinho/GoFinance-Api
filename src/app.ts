import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import 'reflect-metadata';
import uploadCsvConfig from './config/uploadCsv';
import createConnection from './database';
import AppError from './errors/AppError';
import routes from './routes';


createConnection();
const app = express();

app.use(express.json());
app.use('/files', express.static(uploadCsvConfig.directory));
app.use(routes);

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  console.error(err);

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

export default app;
