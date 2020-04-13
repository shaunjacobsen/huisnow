import express from 'express';
import paginate, { formatPaginated } from '../utils/paginate';
import Property from '../models/Property';

export const handleGetAll = async (
  req: express.Request,
  res: express.Response,
) => {
  const { page, size } = req.query;
  const pagination = { page: page || 0, size: size || 10 };
  const all = await Property.findAndCountAll({
    ...paginate(pagination),
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

export const handleCreate = async (
  req: express.Request,
  res: express.Response,
) => {
  if (!req.body) return res.send(400);


  const action = Array.isArray(req.body)
    ? Property.bulkCreate(req.body)
    : Property.create(req.body);

  try {
    const result = await action;
    res.json(result);
  } catch (e) {
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

    const deleted = await record.destroy();
    if (deleted) return res.send(200);
  } catch (e) {
    res.status(400).json(e);
  }
};
