import validator from 'validator';

interface LoginCredentials {
  email: string;
  password: string;
}

const validateLoginCredentials = ({ email, password }: LoginCredentials): boolean => {
  if (!validator.isEmail(email)) return false;
  if (!validator.isLength(password, { min: 6 })) return false;
  return true;
};

export default validateLoginCredentials;