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
import { authenticate } from '../middleware/authenticate';

const router = express.Router();

router.use(authenticate({ required: false }));

router.get('/', handleGetAll);

router.get('/:id', handleGetById);

router.post('/', handleCreate);

router.post('/:id/viewing', handleCreateViewing);

router.put('/:id', handleUpdateById);

router.put('/:id/viewing', handleUpdateViewing);

router.delete('/:id', handleDelete);

router.delete('/:id/viewing', handleDeleteViewing);

export default router;
