import { Router } from "express";
import * as authServices from "./services/registration.service.js";
import * as loginServices from "./services/login.service.js";
import * as validators from "./auth.validation.js";
import { validation } from "../../middleware/validation.middleware.js";

const authRouter = Router();

authRouter.post(
  "/signup",
  validation(validators.signupValidator),
  authServices.signup
);
authRouter.patch("/confirm-email", authServices.confirmEmail);
authRouter.post(
  "/login",
  validation(validators.loginValidator),
  loginServices.login
);

authRouter.post(
  "/send-otp",
  validation(validators.sendOTPValidator),
  loginServices.forgotPasswordsendOTP
);

export default authRouter;
