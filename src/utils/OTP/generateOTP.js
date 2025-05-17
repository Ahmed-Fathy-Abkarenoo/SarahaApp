import { nanoid } from "nanoid";

export const generateOTP = () => {
  const otp = nanoid(4);
  return otp;
};
