import * as bcrypt from "bcrypt";

export const generateHash = ({
  plainText = "",
  saltRounds = parseInt(process.env.SALT_ROUNDS),
} = {}) => {
  const hash = bcrypt.hashSync(plainText, saltRounds);
  return hash;
};

export const compareHash = ({ plainText = "", hashValue = "" } = {}) => {
  const match = bcrypt.compareSync(plainText, hashValue);
  return match;
};
