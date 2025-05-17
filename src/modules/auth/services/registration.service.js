import userModel from "../../../DB/models/User.model.js";
import { emailEvent } from "../../../utils/Events/sendEmail.event.js";
import { asyncHandler } from "../../../utils/error/error.handling.js";
import { successHandler } from "../../../utils/response/success.response.js";
import { verifyToken } from "../../../utils/Token/token.js";
import { generateHash } from "../../../utils/hash/hash.js";
import { generateEncrypt } from "../../../utils/hash/Encryption.js";
import { emailTemplate } from "../../../utils/sendEmail/templates/confirmEmailtemplate.js";

export const signup = asyncHandler(async (req, res, next) => {
  const { userName, email, password, confirmationPassword, phone } = req.body;

  if (password !== confirmationPassword) {
    return next(
      new Error("password and confirmationPassword mismatch", { cause: 400 })
    );
  }

  if (await userModel.findOne({ email })) {
    return next(new Error("Email Exist", { cause: 409 }));
  }
  const phoneCipherText = generateEncrypt({ plainText: phone });

  const hashPass = generateHash({ plainText: password });

  const { _id } = await userModel.create({
    userName,
    email,
    password: hashPass,
    phone: phoneCipherText,
  });

  emailEvent.emit("sendEmail", { template: emailTemplate, email });
  return successHandler({
    res,
    status: 201,
    msg: "Registration Done",
    data: { id: _id },
  });
});

export const confirmEmail = asyncHandler(async (req, res, next) => {
  const { authorization } = req.headers;

  const { email } = verifyToken({
    token: authorization,
    signature: process.env.EMAIL_SIGNATURE,
  });

  const user = await userModel.findOneAndUpdate(
    {
      email,
      confirmEmail: false,
    },
    { confirmEmail: true }
  );

  return successHandler({
    res,
    status: 200,
    msg: "Email verified",
    data: { user },
  });
});
