import express from 'express';

import paginate, { formatPaginated } from '../utils/paginate';
import Property from '../models/Property';
import UserInterest from '../models/UserInterest';

import { AuthenticatedRequest } from '../types';
import User from '../models/User';

function joinWithUserInterest(user: User | null | undefined): {} {
  console.log('USER', user);
  if (!user) return {};

  return {
    include: [
      {
        model: UserInterest,
        required: false,
        where: { user_id: user.id },
      },
    ],
  };
}

export const handleGetAll = async (
  req: AuthenticatedRequest,
  res: express.Response,
) => {
  const { page, size } = req.query;
  const pagination = { page: Number(page) || 0, size: Number(size) || 10 };

  const all = await Property.findAndCountAll({
    ...paginate(pagination),
    ...joinWithUserInterest(req.user),
    order: [['created_at', 'DESC']],
  });

  res.json(formatPaginated(all, pagination));
};

export const handleGetById = async (
  req: express.Request,
  res: express.Response,
) => {
  const id = req.params.id;
  if (!id) return res.send(400);

  try {
    const record = await Property.findByPk(id);
    if (!record) return res.send(404);

    res.json(record);
  } catch (e) {
    res.status(400).json(e);
  }
};

function getErrors(e: any): string[] {
  let errors: string[] = [];
  if (Array.isArray(e.errors)) {
    errors = e.errors.map((error: any) => error.validatorKey);
  } else {
    console.log('ERROR', e);
  }
  return errors;
}

function convertCoordsToGeoJson(coords: number[]) {
  if (!coords || !Array.isArray(coords)) return null;
  return { type: 'Point', coordinates: coords }; // coords: [longitude, latitude]
}

export const handleCreate = async (
  req: express.Request,
  res: express.Response,
) => {
  if (!req.body) return res.send(400);

  const data = Array.isArray(req.body)
    ? req.body.map(datum => {
        return { ...datum, coords: convertCoordsToGeoJson(datum.coords) };
      })
    : { ...req.body, coords: convertCoordsToGeoJson(req.body.coords) };

  const action = Array.isArray(data)
    ? Property.bulkCreate(data)
    : Property.create(data);

  try {
    const result = await action;
    res.json(result);
  } catch (e) {
    const errors = getErrors(e);
    if (errors.find(error => error === 'not_unique')) {
      return res.status(400).json({ error: 'not_unique' });
    }
    res.status(400).json(e);
  }
};

export const handleUpdateById = async (
  req: express.Request,
  res: express.Response,
) => {
  const id = req.params.id;
  if (!req.body || !id) return res.send(400);

  try {
    const record = await Property.findByPk(id);
    if (!record) return res.send(404);

    const updated = await record.update(req.body);
    res.json(updated);
  } catch (e) {
    res.status(400).json(e);
  }
};

export const handleDelete = async (
  req: express.Request,
  res: express.Response,
) => {
  const id = req.params.id;
  if (!id) return res.send(400);

  try {
    const record = await Property.findByPk(id);
    if (!record) return res.send(404);

    await record.destroy();
    return res.send(200);
  } catch (e) {
    res.status(400).json(e);
  }
};
