import express from 'express';
import {
  handleGetAll,
  handleGetById,
  handleCreate,
  handleUpdateById,
  handleDelete,
} from '../controllers/properties';
import { authenticate } from '../middleware/authenticate';

const router = express.Router();

router.use(authenticate({ required: false }));

router.get('/', handleGetAll);

router.get('/:id', handleGetById);

router.post('/', handleCreate);

router.put('/:id', handleUpdateById);

router.delete('/:id', handleDelete);

export default router;
