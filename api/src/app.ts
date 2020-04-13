import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import './config/db';

import mainRouter from './router';
import Property from './models/Property';
import UserInterest from './models/UserInterest';

Property;
UserInterest;

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/', mainRouter);

const port = process.env.PORT || 4000;

app.listen(port, function () {
  console.log(`Up on ${port}`);
});
