interface PaginateOpts {
  page: number;
  size: number;
  total?: number;
}

const paginate = (
  { page, size }: PaginateOpts = { page: 0, size: 10 },
): { offset: number; limit: number } => {
  const offset = page * size;

  return { offset, limit: size };
};

export const formatPaginated = (response: any, paginate: PaginateOpts) => {
  return { ...paginate, total: response.count, data: response.rows };
};

export default paginate;
