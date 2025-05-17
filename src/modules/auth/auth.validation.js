import Joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";

export const signupValidator = Joi.object()
  .keys({
    userName: generalFields.userName.required(),
    email: generalFields.email.required(),
    password: generalFields.password.required(),
    confirmationPassword: generalFields.confirmationPassword
      .valid(Joi.ref("password"))
      .required(),
    phone: generalFields.phone.required(),
    "accept-language": generalFields.acceptLanguage.required(),
  })
  .options({ allowUnknown: false })
  .required();

export const loginValidator = Joi.object()
  .keys({
    email: generalFields.email.required(),
    password: generalFields.password.required(),
  })
  .options({ allowUnknown: false })
  .required();

export const sendOTPValidator = Joi.object()
  .keys({
    email: generalFields.email.required(),
  })
  .required();
