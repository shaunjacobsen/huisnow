import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import './config/db';

import propertiesRouter from './router/properties';
import Property from './models/Property';
import UserInterest from './models/UserInterest';

Property;
UserInterest;

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/properties', propertiesRouter);

const port = process.env.PORT || 4000;

app.listen(port, function () {
  console.log(`Up on ${port}`);
});
