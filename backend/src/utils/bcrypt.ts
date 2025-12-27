import bcrypt from "bcryptjs";

export const hashPassword = async (
  password: string,
  saltRound: number = 10
): Promise<string> => {
  const salt = await bcrypt.genSalt(saltRound);
  return await bcrypt.hash(password, salt);
};

export const compareValue = async (
  value: string,
  hash: string
): Promise<boolean> => {
  return await bcrypt.compare(value, hash);
};
