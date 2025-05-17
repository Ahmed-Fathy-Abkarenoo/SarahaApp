export const successHandler = ({ res, status, msg, data } = {}) => {
  return res.status(status || 200).json({ successMessage: msg, data });
};
