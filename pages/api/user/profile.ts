import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/dbConnect';
import verifyAuth from '../../../lib/auth/verifyAuth';
import User from '../../../models/User';
import validateProfileUpdate from '../../../lib/utils/validateProfileUpdate';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  const session = await verifyAuth(req, res);
  if (!session) {
    return;
  }

  if (req.method === 'GET') {
    try {
      const user = await User.findById(session.user._id);
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'PUT') {
    const { fullName, email, bio, avatar } = req.body;
    const updateData = { fullName, email, 'profile.bio': bio, 'profile.avatar': avatar };

    if (!validateProfileUpdate(updateData)) {
      return res.status(400).json({ message: 'Invalid input' });
    }

    try {
      await User.updateOne({ _id: session.user._id }, updateData);
      res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}