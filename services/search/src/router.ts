import express from 'express';

import { crawl } from './pararius';

const router = express.Router();

router.get('/run', async (req: express.Request, res: express.Request) => {
  const searchUrl = req.query.search_url;
  if (!searchUrl)
    return res.status(400).json({ error: 'Must specify search URL' });
    
  try {
    const results = await crawl(searchUrl);
    res.json(results);
  } catch (e) {
    res.status(400).json(e);
  }
});

export default router;
