import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

require('dotenv').config();

import propertiesRouter from './router/properties';
import userInterestRouter from './router/user_interest';
import userRouter from './router/user';

import Property from './models/Property';
import UserInterest from './models/UserInterest';
import PropertyViewing from './models/PropertyViewing';

import sequelize from './config/db';
import './config/redis';

Property;
UserInterest;
PropertyViewing;

const app = express();

app.use(morgan('tiny'));

app.use(helmet());
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

app.use('/properties', propertiesRouter);
// app.use('/interest', userInterestRouter);
app.use('/user', userRouter);

const port = process.env.PORT || 4000;

app.listen(port, function () {
  console.log(`Up on ${port}`);
});
