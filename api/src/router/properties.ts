import express from 'express';
import {
  handleGetAll,
  handleGetById,
  handleCreate,
  handleUpdateById,
  handleDelete,
} from '../controllers/properties';

const router = express.Router();

router.get('/', handleGetAll);

router.get('/:id', handleGetById);

router.post('/', handleCreate);

router.put('/:id', handleUpdateById);

router.delete('/:id', handleDelete);

export default router;
