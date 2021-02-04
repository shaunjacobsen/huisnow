import { Request, Response } from 'express';

import Property from '../models/Property';
import UserInterest from '../models/UserInterest';
import { AuthenticatedRequest, UserInterestUpdateables } from '../types';

async function updateOrCreateInterestRecord(
  userId: number,
  propertyId: number,
  data: UserInterestUpdateables,
): Promise<UserInterest> {
  return new Promise(async (resolve, reject) => {
    const property = await Property.findOne({ where: { id: propertyId } });
    if (!property) return reject(new Error('PROPERTY_DOES_NOT_EXIST'));

    UserInterest.upsert(
      {
        userId,
        propertyId,
        ...data,
      },
      { returning: true },
    )
      .then(record => resolve(record[0]))
      .catch(e => reject(e));
  });
}

export const handleTogglePropertySave = async (
  // req: AuthenticatedRequest,
  req: Request,
  res: Response,
) => {
  const userId = 1;
  const propertyId = Number(req.params.id);

  try {
    const existingRecord = await UserInterest.findOne({
      where: { userId, propertyId },
    });

    const isInterestedValue = existingRecord
      ? !existingRecord.isInterested
      : true;

    const userInterestRecord = await updateOrCreateInterestRecord(
      userId,
      propertyId,
      { isInterested: isInterestedValue },
    );
    res.json(userInterestRecord);
  } catch (e) {
    if (e.message === 'PROPERTY_DOES_NOT_EXIST') {
      return res.status(404).send();
    }
    res.status(400).json({ message: e.message });
  }
};

export const handleUpdatePropertyInterest = async (
  // req: AuthenticatedRequest,
  req: Request,
  res: Response,
) => {
  const userId = 1;
  const propertyId = Number(req.params.id);
  const { isInterested, hasContacted, contactedDate, status } = req.body;

  try {
    const userInterestRecord = await updateOrCreateInterestRecord(
      userId,
      propertyId,
      {
        isInterested,
        hasContacted,
        contactedDate,
        status,
      },
    );
    res.json(userInterestRecord);
  } catch (e) {
    res.status(400).json(e.message);
  }
};
