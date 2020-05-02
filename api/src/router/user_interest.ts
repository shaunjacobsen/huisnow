import express from 'express';

import { authenticate } from '../middleware/authenticate';

import {
  handleTogglePropertySave,
  handleUpdatePropertyInterest,
} from './../controllers/user_interest';

const router = express.Router();

router.use(authenticate({ required: true }));

router.put('/:propertyId', handleUpdatePropertyInterest);
router.post('/:propertyId/save', handleTogglePropertySave);

export default router;
