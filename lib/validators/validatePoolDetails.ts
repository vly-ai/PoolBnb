import validator from 'validator';

interface PoolDetails {
  name: string;
  location: string;
  description: string;
  price: number;
  availability: { startDate: Date; endDate: Date }[];
  amenities: string[];
  photos: string[];
}

const validatePoolDetails = ({ name, location, description, price, availability, amenities, photos }: PoolDetails): boolean => {
  if (!validator.isLength(name, { min: 1, max: 100 })) return false;
  if (!validator.isLength(location, { min: 1, max: 200 })) return false;
  if (!validator.isLength(description, { min: 1, max: 1000 })) return false;
  if (typeof price !== 'number' || price <= 0) return false;
  if (!Array.isArray(availability) || availability.length === 0) return false;
  for (const { startDate, endDate } of availability) {
    if (!validator.isISO8601(startDate.toString()) || !validator.isISO8601(endDate.toString())) return false;
  }
  if (!Array.isArray(amenities) || amenities.length === 0) return false;
  if (!Array.isArray(photos) || photos.length === 0) return false;
  for (const photo of photos) {
    if (!validator.isURL(photo)) return false;
  }
  return true;
};

export default validatePoolDetails;