import Joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";

export const updateProfileValidator = Joi.object()
  .keys({
    userName: generalFields.userName,
    phone: generalFields.phone,
    gender: generalFields.gender,
    DOB: generalFields.DOB,
  })
  .required();

export const updatePasswordValidator = Joi.object()
  .keys({
    oldPassword: generalFields.password.required(),
    newPassword: generalFields.password.not(Joi.ref("oldPassword")).required(),
    confirmationPassword: generalFields.confirmationPassword
      .valid(Joi.ref("newPassword"))
      .required(),
  })
  .required();

export const shareProfileValidator = Joi.object()
  .keys({
    userId: generalFields.id.required(),
  })
  .required();

export const reActivateValidator = Joi.object()
  .keys({
    email: generalFields.email.required(),
  })
  .required();

export const changeForgetenPasswordValidator = Joi.object()
  .keys({
    newPassword: generalFields.password.required(),
    confirmationPassword: generalFields.confirmationPassword
      .valid(Joi.ref("newPassword"))
      .required(),
    OTP: generalFields.OTP.required(),
  })
  .required();
