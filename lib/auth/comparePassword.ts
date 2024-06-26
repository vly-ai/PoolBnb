import bcrypt from 'bcrypt';

const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

export default comparePassword;