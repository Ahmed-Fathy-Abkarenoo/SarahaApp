import CryptoJS from "crypto-js";

export const generateEncrypt = ({
  plainText,
  signature = process.env.ENCRYPTION_SIGNATURE,
} = {}) => {
  const hash = CryptoJS.AES.encrypt(plainText, signature).toString();
  return hash;
};

export const decodeEncryption = ({
  cipherText = "",
  signature = process.env.ENCRYPTION_SIGNATURE,
} = {}) => {
  const decode = CryptoJS.AES.decrypt(cipherText, signature).toString(
    CryptoJS.enc.Utf8
  );
  return decode;
};
