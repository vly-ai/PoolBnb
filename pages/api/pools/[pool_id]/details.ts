import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../../lib/dbConnect';
import Pool, { IPool } from '../../../../models/Pool';
import validatePoolId from '../../../../lib/utils/validatePoolId';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { pool_id } = req.query;

  if (!validatePoolId(pool_id as string)) {
    return res.status(400).json({ message: 'Invalid pool ID' });
  }

  try {
    const pool: IPool | null = await Pool.findById(pool_id);
    if (!pool) {
      return res.status(404).json({ message: 'Pool not found' });
    }
    res.status(200).json(pool);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}