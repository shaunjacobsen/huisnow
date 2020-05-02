import Express from 'express';
import User from './../models/User';

export interface AuthenticatedRequest extends Express.Request {
  user?: User | null;
}
