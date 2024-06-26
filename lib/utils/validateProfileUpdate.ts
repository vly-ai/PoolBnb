import validator from 'validator';

interface ProfileUpdate {
  fullName?: string;
  email?: string;
  bio?: string;
  avatar?: string;
}

const validateProfileUpdate = ({ fullName, email, bio, avatar }: ProfileUpdate): boolean => {
  if (fullName && !validator.isLength(fullName, { min: 1, max: 100 })) return false;
  if (email && !validator.isEmail(email)) return false;
  if (bio && !validator.isLength(bio, { max: 500 })) return false;
  if (avatar && !validator.isURL(avatar)) return false;
  return true;
};

export default validateProfileUpdate;