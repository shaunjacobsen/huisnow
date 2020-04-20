import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

require('dotenv').config();

import propertiesRouter from './router/properties';
import Property from './models/Property';
import UserInterest from './models/UserInterest';

import './config/db';
import './config/redis';

Property;
UserInterest;

const app = express();

app.use(helmet());
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

app.use('/properties', propertiesRouter);

const port = process.env.PORT || 4000;

app.listen(port, function () {
  console.log(`Up on ${port}`);
});
