import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/dbConnect';
import verifyAuth from '../../../lib/auth/verifyAuth';
import validatePoolDetails from '../../../lib/validators/validatePoolDetails';
import handlePhotoUpload from '../../../lib/upload/handlePhotoUpload';
import Pool from '../../../models/Pool';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await verifyAuth(req, res);
  if (!session) {
    return;
  }

  handlePhotoUpload(req, res, async (files) => {
    const { name, location, description, price, amenities, availability } = req.body;
    const photos = files.photos ? Array.isArray(files.photos) ? files.photos.map(file => file.path) : [files.photos.path] : [];

    const poolDetails = { name, location, description, price, amenities, availability, photos };
    if (!validatePoolDetails(poolDetails)) {
      return res.status(400).json({ message: 'Invalid pool details' });
    }

    try {
      const newPool = await Pool.create({ ...poolDetails, host: session.user._id });
      res.status(201).json({ message: 'Pool created successfully', pool: newPool });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });
}