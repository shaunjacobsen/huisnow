import express from 'express';

const router = express.Router();

router.use('/', (req, res) => {
  res.json('Hello, world');
});

export default router;
