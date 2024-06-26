import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

const verifyAuth = async (req: NextApiRequest, res: NextApiResponse): Promise<any> => {
  const session = await getSession({ req });
  if (!session) {
    res.status(401).json({ message: 'Unauthorized' });
    return null;
  }
  return session;
};

export default verifyAuth;