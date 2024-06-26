import { isValidObjectId } from 'mongoose';

const validatePoolId = (poolId: string): boolean => {
  return isValidObjectId(poolId);
};

export default validatePoolId;