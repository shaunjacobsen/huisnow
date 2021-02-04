import express from 'express';
import {
  handleGetAll,
  handleGetById,
  handleCreate,
  handleUpdateById,
  handleDelete,
} from '../controllers/properties';
import {
  handleCreateViewing,
  handleDeleteViewing,
  handleUpdateViewing,
} from '../controllers/property_viewing';
import {
  handleTogglePropertySave,
  handleUpdatePropertyInterest,
} from '../controllers/user_interest';

import { authenticate } from '../middleware/authenticate';

const router = express.Router();

router.use(authenticate({ required: false }));

router.get('/', handleGetAll);

router.get('/:id', handleGetById);

router.post('/', handleCreate);

router.post('/:id/viewing', handleCreateViewing);
router.post('/:id/save', handleTogglePropertySave);
router.post('/:id/interest', handleUpdatePropertyInterest);

router.put('/:id', handleUpdateById);

router.put('/:id/viewing', handleUpdateViewing);
router.put('/:id/interest', handleUpdatePropertyInterest);

router.delete('/:id', handleDelete);

router.delete('/:id/viewing', handleDeleteViewing);

export default router;
