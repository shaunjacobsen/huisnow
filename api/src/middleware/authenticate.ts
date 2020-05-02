import express, { Request, Response, NextFunction } from 'express';

import { AuthenticatedRequest } from './../types';
import User, { Role } from '../models/User';

import { validateToken } from './../auth/';

const authenticate = (opts = { required: true }) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.get('X-auth');

    if (!opts.required && !token) {
      next();
      return;
    }

    if (!token) {
      res.status(401).json({ status: 'ERROR', message: 'AUTH_REQUIRED' });
    }

    validateToken(token)
      .then((decodedToken: any) => {
        User.findOne({ where: { firebaseId: decodedToken.uid } })
          .then((user: User | null) => {
            req.user = user;
            next();
          })
          .catch((e: Error) => {
            console.error('User authentication error:', e);
            res.status(400).send();
          });
      })
      .catch((e: Error) => {
        console.error('User authentication error:', e);
        res.status(401).json(e);
      });
  };
};

const isAllowed = (role: Role, rolesAllowed: [Role]) => {
  return rolesAllowed.indexOf(role) > -1;
};

const permit = (...allowed: [Role]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (req.user && isAllowed(req.user.role, allowed)) {
      next();
    } else {
      res.status(403).json({ status: 'ERROR', message: 'FORBIDDEN' });
    }
  };
};

export { authenticate, permit };
