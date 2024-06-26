import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../../lib/dbConnect';
import verifyAuth from '../../../../lib/auth/verifyAuth';
import validateBookingDetails from '../../../../lib/utils/validateBookingDetails';
import Booking from '../../../../models/Booking';
import Pool from '../../../../models/Pool';
import validatePoolId from '../../../../lib/utils/validatePoolId';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await verifyAuth(req, res);
  if (!session) {
    return;
  }

  const { pool_id } = req.query;
  const { startDate, endDate, guests } = req.body;

  if (!validatePoolId(pool_id as string)) {
    return res.status(400).json({ message: 'Invalid pool ID' });
  }

  if (!validateBookingDetails({ startDate, endDate, guests })) {
    return res.status(400).json({ message: 'Invalid booking details' });
  }

  try {
    const pool = await Pool.findById(pool_id);
    if (!pool) {
      return res.status(404).json({ message: 'Pool not found' });
    }

    const isAvailable = pool.availability.some(({ startDate: start, endDate: end }) => new Date(startDate) >= start && new Date(endDate) <= end);
    if (!isAvailable) {
      return res.status(400).json({ message: 'Pool is not available for the selected dates' });
    }

    const newBooking = await Booking.create({ pool: pool_id, user: session.user._id, startDate, endDate, guests, status: 'confirmed' });
    res.status(201).json({ message: 'Booking created successfully', booking: newBooking });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}