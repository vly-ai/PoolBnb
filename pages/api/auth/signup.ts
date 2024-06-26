import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/User';
import validateSignupCredentials from '../../../lib/auth/validateSignupCredentials';
import hashPassword from '../../../lib/auth/hashPassword';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { fullName, email, password, confirmPassword } = req.body;

  if (!validateSignupCredentials({ fullName, email, password, confirmPassword })) {
    return res.status(400).json({ message: 'Invalid input' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    const hashedPassword = await hashPassword(password);
    const newUser = await User.create({ fullName, email, password: hashedPassword });
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}