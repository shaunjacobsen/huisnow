import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 4000;

const server = app.listen(port, function() {
  console.log(`Up on ${port}`);
});