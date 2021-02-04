import express from 'express';

import paginate, { formatPaginated } from '../utils/paginate';
import Property from '../models/Property';
import PropertyViewing from '../models/PropertyViewing';

import { AuthenticatedRequest } from '../types';
import User from '../models/User';
import { Sequelize } from 'sequelize';

export const handleCreateViewing = async (
  req: AuthenticatedRequest,
  res: express.Response,
) => {
  const { id: propertyId } = req.params;
  const body = req.body;

  // create a viewing instance
  // save it
  const viewing = new PropertyViewing({
    propertyId,
    userId: 1, // hard coded for now
    viewingDate: body.viewing_date,
    contactName: body.contact_name,
    contactEmail: body.contact_email,
    contactPhone: body.contact_phone,
    preViewingNotes: body.pre_viewing_notes,
  });

  try {
    await viewing.save();
    return res.status(201).json(viewing);
  } catch (e) {
    if (e.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'not_unique' });
    }
    return res.status(400).json({ error: e });
  }
};

export const handleUpdateViewing = async (
  req: AuthenticatedRequest,
  res: express.Response,
) => {
  const { id: propertyId } = req.params;
  const body = req.body;

  const updateValues = {
    ...(!!body.viewing_date ? { viewingDate: body.viewing_date } : {}),
    ...(!!body.contact_name ? { contactName: body.contact_name } : {}),
    ...(!!body.contact_email ? { contactEmail: body.contact_email } : {}),
    ...(!!body.contact_phone ? { contactPhone: body.contact_phone } : {}),
    ...(!!body.pre_viewing_notes
      ? { pre_viewing_notes: body.pre_viewing_notes }
      : {}),
    ...(!!body.viewing_notes ? { viewingNotes: body.viewing_notes } : {}),
    ...(!!body.pros ? { pros: body.pros } : {}),
    ...(!!body.cons ? { cons: body.cons } : {}),
  };

  try {
    const viewing = await PropertyViewing.findOne({
      where: {
        propertyId,
        userId: 1,
      },
    });

    if (!viewing) return res.send(404);

    const saved = await viewing?.update(updateValues);

    return res.json(saved);
  } catch (e) {
    return res.status(400).json({ error: e });
  }
};

export const handleDeleteViewing = async (
  req: express.Request,
  res: express.Response,
) => {
  const { id: propertyId } = req.params;

  try {
    const record = await PropertyViewing.findOne({
      where: {
        propertyId,
        userId: 1,
      },
    });

    if (!record) return res.send(404);

    await record.destroy();
    return res.send(200);
  } catch (e) {
    return res.status(400).json({ error: e });
  }
};
