import Express from 'express';
import User from './../models/User';
import { UserInterestStatus } from './../models/UserInterest';

export interface AuthenticatedRequest extends Express.Request {
  user?: User | null;
}

export interface UserInterestUpdateables {
  isInterested?: Boolean;
  hasContacted?: Boolean;
  contactedDate?: Date;
  status?: UserInterestStatus;
  viewingTime?: Date;
  viewingNotes?: String;
}
