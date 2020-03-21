import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import './config/db';

import Property from './models/Property';
import UserInterest from './models/UserInterest';

Property;
UserInterest;

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 4000;

const server = app.listen(port, function() {
  console.log(`Up on ${port}`);
});
