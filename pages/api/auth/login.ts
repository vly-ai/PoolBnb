import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/User';
import validateLoginCredentials from '../../../lib/auth/validateLoginCredentials';
import comparePassword from '../../../lib/auth/comparePassword';
import { signIn } from 'next-auth/react';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  if (!validateLoginCredentials({ email, password })) {
    return res.status(400).json({ message: 'Invalid input' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    await signIn('credentials', { email, password, redirect: false });
    res.status(200).json({ message: 'Logged in successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}