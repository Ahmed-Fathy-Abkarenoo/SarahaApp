import Joi from "joi";
import { genderTypes } from "../utils/constants/constants.js";
import { Types } from "mongoose";

export const generalFields = {
  id: Joi.string().custom((value, helper) => {
    return Types.ObjectId.isValid(value)
      ? value
      : helper.message("In-valid objectId");
  }),
  userName: Joi.string().min(2).max(25).alphanum().messages({
    "string.alphanum": "user name cannot contain any special charatcter",
    "string.empty": "user name cannot be empty",
    "any.required": "user name is required",
  }),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      maxDomainSegments: 3,
      tlds: { allow: ["com", "edu", "net"] },
    })
    .messages({
      "string.email": "please enter valid email format like example@gmail.com",
      "string.empty": "email cannot be empty",
      "any.required": "email is required",
    }),
  password: Joi.string()
    .pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/))
    .messages({
      "string.pattern.base":
        "password must contain at least one uppercase, one lowercase character and numbers and it's length not less than 8",
    }),
  confirmationPassword: Joi.string(),
  phone: Joi.string().pattern(new RegExp(/^(002|\+2)?01[0125][0-9]{8}$/)),
  acceptLanguage: Joi.string().valid("en", "ar").default("en"),
  gender: Joi.string().valid(genderTypes.male, genderTypes.female),
  DOB: Joi.date().less("now"),
  OTP: Joi.string().length(4),
};

export const validation = (schema) => {
  return (req, res, next) => {
    const inputData = { ...req.body, ...req.params, ...req.query };
    if (req.headers["accept-language"]) {
      inputData["accept-language"] = req.headers["accept-language"];
    }

    const validationError = schema.validate(inputData, { abortEarly: false });
    if (validationError.error) {
      return res.status(400).json({
        message: "validation Error",
        validationError: validationError.error.details,
      });
    }

    return next();
  };
};
