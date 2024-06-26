import bcrypt from 'bcrypt';

const hashPassword = async (password: string, saltRounds: number = 10): Promise<string> => {
  return await bcrypt.hash(password, saltRounds);
};

export default hashPassword;