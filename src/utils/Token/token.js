import jwt from "jsonwebtoken";

export const generateToken = ({
  payLoad = {},
  signature = process.env.TOKEN_SIGNATURE,
  options = {},
} = {}) => {
  const token = jwt.sign(payLoad, signature, options);
  return token;
};

export const verifyToken = ({
  token = "",
  signature = process.env.TOKEN_SIGNATURE,
} = {}) => {
  const decoded = jwt.verify(token, signature);
  return decoded;
};
