import * as express from 'express';

import { crawl } from './pararius';

const router = express.Router();

router.get('/search', async (req: express.Request, res: express.Response) => {
  const searchUrl: string = req.query.search_url as string;
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
