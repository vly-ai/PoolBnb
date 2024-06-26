import { isValidObjectId } from 'mongoose';
import validator from 'validator';

interface SearchCriteria {
  location: string;
  startDate: string;
  endDate: string;
  priceRange?: { min: number; max: number };
  features?: string[];
}

const validateSearchCriteria = ({ location, startDate, endDate, priceRange, features }: SearchCriteria): boolean => {
  if (!validator.isLength(location, { min: 1, max: 100 })) return false;
  if (!validator.isISO8601(startDate)) return false;
  if (!validator.isISO8601(endDate)) return false;
  if (priceRange && typeof priceRange.min !== 'number' && typeof priceRange.max !== 'number') return false;
  if (features && !Array.isArray(features)) return false;
  return true;
};

export default validateSearchCriteria;