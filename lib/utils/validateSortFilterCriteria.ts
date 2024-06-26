import validator from 'validator';

interface SortFilterCriteria {
  sortBy?: string;
  order?: 'asc' | 'desc';
  priceRange?: { min: number; max: number };
  features?: string[];
}

const validateSortFilterCriteria = ({ sortBy, order, priceRange, features }: SortFilterCriteria): boolean => {
  if (sortBy && !validator.isLength(sortBy, { min: 1, max: 100 })) return false;
  if (order && !['asc', 'desc'].includes(order)) return false;
  if (priceRange && (typeof priceRange.min !== 'number' || typeof priceRange.max !== 'number')) return false;
  if (features && !Array.isArray(features)) return false;
  return true;
};

export default validateSortFilterCriteria;