import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/dbConnect';
import Pool, { IPool } from '../../models/Pool';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const featuredPools: IPool[] = await Pool.find({ featured: true });
    res.status(200).json(featuredPools);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}