import { Request, Response } from 'express';

import { signIn, createUser } from '../auth';

import { AuthenticatedRequest } from '../types';
import User, { Role } from '../models/User';

export const handleGetCurrentUser = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    res.json({ user: req.user });
  } catch (e) {
    res.status(500).send({ error: e });
  }
};

export const handleSignIn = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'MISSING_FIELDS' });
  try {
    const user = await signIn(email, password);
    if (!user) throw new Error();
    res.header('X-auth', await user!.firebase!.user!.getIdToken());
    res.json({ user: { ...user, firebase: user!.firebase!.user!.uid } });
  } catch (e) {
    switch (e) {
      case 'auth/invalid-email':
        res.status(401).json({ error: 'INVALID_EMAIL' });
        break;
      case 'auth/user-disabled':
        res.status(400).json({ error: 'USER_DISABLED' });
        break;
      case 'auth/user-not-found':
        res.status(400).json({ error: 'USER_NOT_FOUND' });
        break;
      case 'auth/wrong-password':
        res.status(400).json({ error: 'INCORRECT_PASSWORD' });
        break;
      default:
        res.status(500).json({ error: e.message });
    }
  }
};

export const handleCreateUser = async (req: Request, res: Response) => {
  const { password, email } = req.body;
  if (!password || !email)
    return res.status(400).json({ error: 'MISSING_FIELDS' });
  try {
    // search for user in db by email address
    // if exists, for now, return non-unique error
    // this will later be modified to support merging accounts (e.g. with google, apple)
    const userInDb = await User.findOne({ where: { email } });
    if (!userInDb) {
      // create new user
      createUser({ password, email })
        .then(newUser => {
          User.create({
            email,
            firebaseId: newUser.uid,
            role: Role.user,
          })
            .then(userInDb => {
              const userData = { id: userInDb.id };
              res.status(201).json({ status: 'OK', user: userData });
            })
            .catch(e => {
              res.status(400).json({ error: e });
            });
        })
        .catch(e => {
          res.status(400).json({ error: e });
        });
    } else {
      res.status(400).json({ error: 'USER_EXISTS' });
    }
  } catch (e) {
    res.status(400).json({ error: e });
  }
};
