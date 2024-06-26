import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/dbConnect';
import Pool, { IPool } from '../../../models/Pool';
import validateSortFilterCriteria from '../../../lib/utils/validateSortFilterCriteria';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { sortBy, order, priceRange, features } = req.query;
  const sortFilterCriteria = { sortBy, order, priceRange, features };

  if (!validateSortFilterCriteria(sortFilterCriteria)) {
    return res.status(400).json({ message: 'Invalid sort/filter criteria' });
  }

  try {
    const sortOptions: any = {};
    if (sortBy) sortOptions[sortBy] = order === 'asc' ? 1 : -1;

    const filters: any = {
      ...(priceRange && { price: { $gte: (priceRange as any).min, $lte: (priceRange as any).max } }),
      ...(features && { amenities: { $all: features } }),
    };

    const pools: IPool[] = await Pool.find(filters).sort(sortOptions);
    res.status(200).json(pools);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}