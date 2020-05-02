import express from 'express';

import { authenticate } from '../middleware/authenticate';

import { handleTogglePropertySave } from './../controllers/user_interest';

const router = express.Router();

router.use(authenticate);

router.put('/save/:propertyId', handleTogglePropertySave);

export default router;
