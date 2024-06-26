import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/dbConnect';
import Pool, { IPool } from '../../../models/Pool';
import validateSearchCriteria from '../../../lib/utils/validateSearchCriteria';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { location, startDate, endDate, priceRange, features } = req.query;
  const searchCriteria = { location, startDate, endDate, priceRange, features };

  if (!validateSearchCriteria(searchCriteria)) {
    return res.status(400).json({ message: 'Invalid search criteria' });
  }

  try {
    const pools: IPool[] = await Pool.find({
      location: new RegExp(location, 'i'),
      'availability.startDate': { $lte: new Date(startDate as string) },
      'availability.endDate': { $gte: new Date(endDate as string) },
      ...(priceRange && { price: { $gte: (priceRange as any).min, $lte: (priceRange as any).max } }),
      ...(features && { amenities: { $all: features } }),
    });
    res.status(200).json(pools);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}