import userModel from "../DB/models/User.model.js";
import { asyncHandler } from "../utils/error/error.handling.js";
import { verifyToken } from "../utils/Token/token.js";

export const authentication = () => {
  return asyncHandler(async (req, res, next) => {
    const { authorization } = req.headers;

    const [Bearer, token] = authorization?.split(" ") || [];
    if (!Bearer || !token) {
      return next(new Error("authorization is require", { cause: 400 }));
    }

    let TOKEN_SIGNATURE;
    switch (Bearer) {
      case "Bearer":
        TOKEN_SIGNATURE = process.env.TOKEN_SIGNATURE;
        break;

      case "admin":
        TOKEN_SIGNATURE = process.env.TOKEN_SIGNATURE_ADMIN;
        break;

      default:
        break;
    }

    const decoded = verifyToken({ token, signature: TOKEN_SIGNATURE });
    if (!decoded?.id) {
      return next(new Error("invalid token payload", { cause: 400 }));
    }

    const user = await userModel.findById(decoded.id).lean();
    if (!user) {
      return next(new Error("Not Register Account", { cause: 404 }));
    }

    if (
      parseInt((user.changePasswordTime?.getTime() || 0) / 1000) >= decoded.iat
    ) {
      return next(new Error("Expired credential", { cause: 400 }));
    }

    req.user = user;

    return next();
  });
};

export const authorization = (accessRoles = []) => {
  return asyncHandler(async (req, res, next) => {
    if (!accessRoles.includes(req.user.role)) {
      return next(new Error("Not Auth Account", { cause: 403 }));
    }

    return next();
  });
};
