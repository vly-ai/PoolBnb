import validator from 'validator';

interface SignupCredentials {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const validateSignupCredentials = ({ fullName, email, password, confirmPassword }: SignupCredentials): boolean => {
  if (!validator.isLength(fullName, { min: 1, max: 100 })) return false;
  if (!validator.isEmail(email)) return false;
  if (!validator.isLength(password, { min: 6 })) return false;
  if (password !== confirmPassword) return false;
  return true;
};

export default validateSignupCredentials;