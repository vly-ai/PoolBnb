import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/dbConnect';
import verifyAuth from '../../../lib/auth/verifyAuth';
import Pool from '../../../models/Pool';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await verifyAuth(req, res);
  if (!session) {
    return;
  }

  try {
    const listings = await Pool.find({ host: session.user._id });
    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}