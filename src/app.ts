import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import { jwtAuthen } from './middleware/auth_middleware';
import { imageRouter } from './api/image';
import { voteRouter } from './api/vote';
import { authRouter } from './api/auth';
import { userRouter } from './api/user';
import { settingsRouter } from './api/settings';
// App Variables
dotenv.config();

export const app: Application = express();

// using the dependencies
// parse application/json
app.use(bodyParser.json());
// parse form-data
app.use(bodyParser.urlencoded({ extended: true }));

// secure apps by setting various HTTP headers
app.use(helmet()); // security
app.use(
  cors({
    origin: "*"
  })
);

// JWT middleware
app.use(jwtAuthen);

// API
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World');
});

// Routes
app.use('/api/image', imageRouter);
app.use('/api/vote', voteRouter);
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/settings', settingsRouter);
