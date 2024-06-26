import validator from 'validator';

interface BookingDetails {
  startDate: string;
  endDate: string;
  guests: number;
}

const validateBookingDetails = ({ startDate, endDate, guests }: BookingDetails): boolean => {
  if (!validator.isISO8601(startDate)) return false;
  if (!validator.isISO8601(endDate)) return false;
  if (typeof guests !== 'number' || guests <= 0) return false;
  return true;
};

export default validateBookingDetails;