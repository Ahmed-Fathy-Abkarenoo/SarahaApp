import Joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";

export const sendMsgValidator = Joi.object()
  .keys({
    message: Joi.string().required(),
    recipientId: generalFields.id.required(),
  })
  .required();
