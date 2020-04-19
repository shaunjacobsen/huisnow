import express from 'express';
import morgan from 'morgan';

import router from './router';

const app = express();
app.use(express.json());
app.use(morgan('combined'));

app.use('/', router);

const PORT = process.env.PORT || 4001;

app.listen(PORT, () => console.log('Up on 4001'));
