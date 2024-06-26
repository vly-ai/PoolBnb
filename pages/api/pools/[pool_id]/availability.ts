import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../../lib/dbConnect';
import Pool from '../../../../models/Pool';
import validatePoolId from '../../../../lib/utils/validatePoolId';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { pool_id } = req.query;
  const { startDate, endDate } = req.body;

  if (!validatePoolId(pool_id as string)) {
    return res.status(400).json({ message: 'Invalid pool ID' });
  }

  if (!startDate || !endDate) {
    return res.status(400).json({ message: 'Start date and end date are required' });
  }
  
  try {
    const pool = await Pool.findById(pool_id);
    if (!pool) {
      return res.status(404).json({ message: 'Pool not found' });
    }
    const isAvailable = pool.availability.some(({ startDate: start, endDate: end }) => new Date(startDate) >= start && new Date(endDate) <= end);
    res.status(200).json({ available: isAvailable });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}