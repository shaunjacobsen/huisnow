import express from 'express';

import { authenticate } from '../middleware/authenticate';

import { handleCreateUser, handleSignIn } from './../controllers/user';

const router = express.Router();

// no auth routes
router.post('/', handleCreateUser);
router.post('/sign_in', handleSignIn);

// authenticated routes
router.use(authenticate);

export default router;
