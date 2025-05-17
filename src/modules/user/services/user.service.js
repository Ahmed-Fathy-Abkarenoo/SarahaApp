import { asyncHandler } from "../../../utils/error/error.handling.js";
import { successHandler } from "../../../utils/response/success.response.js";
import {
  decodeEncryption,
  generateEncrypt,
} from "../../../utils/hash/Encryption.js";
import userModel from "../../../DB/models/User.model.js";
import MsgModel from "../../../DB/models/Msg.model.js";
import { compareHash, generateHash } from "../../../utils/hash/hash.js";
import { emailEvent } from "../../../utils/Events/sendEmail.event.js";
import { reactivateEmailTemplate } from "../../../utils/sendEmail/templates/reactivateAccountTemlpate.js";
import { verifyToken } from "../../../utils/Token/token.js";
import { emailTemplate } from "../../../utils/sendEmail/templates/confirmEmailtemplate.js";

export const shareProfile = asyncHandler(async (req, res, next) => {
  const user = await userModel
    .findById(req.params.userId)
    .select("userName image");

  return user
    ? successHandler({ res, status: 200, msg: "Done", data: { user } })
    : next(new Error("In-Valid Account Id", { cause: 404 }));
});

export const userProfile = asyncHandler(async (req, res, next) => {
  req.user.phone = decodeEncryption({ cipherText: req.user.phone });
  const messages = await MsgModel.find({
    recipientId: req.user._id,
  }).populate([{ path: "recipientId", select: ["userName"] }]);
  delete req.user.password;

  return successHandler({
    res,
    status: 200,
    msg: "user profile",
    data: { user: req.user, messages },
  });
});

export const updateProfile = asyncHandler(async (req, res, next) => {
  if (req.body.phone) {
    req.body.phone = generateEncrypt({ plainText: req.body.phone });
  }

  const user = await userModel.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
    runValidators: true,
  });

  delete req.user.password;

  return successHandler({
    res,
    status: 200,
    msg: "update profile",
    data: { user },
  });
});

export const updatePassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  if (!compareHash({ plainText: oldPassword, hashValue: req.user.password })) {
    return next(new Error("In-Valid user password", { cause: 400 }));
  }

  const hashPassword = generateHash({ plainText: newPassword });

  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      password: hashPassword,
      changePasswordTime: Date.now(),
    },
    { new: true }
  );

  return successHandler({
    res,
    status: 200,
    msg: "update password",
    data: { user },
  });
});

export const updateEmail = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const checkEmail = await userModel.findOne({ email });

  if (checkEmail) {
    return next(new Error("Email Already Exist", { cause: 409 }));
  }

  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      email,
      confirmEmail: false,
      changePasswordTime: Date.now(),
    },
    { new: true }
  );

  emailEvent.emit("sendEmail", { template: emailTemplate, email });

  return successHandler({
    res,
    status: 200,
    msg: "update email",
    data: { user },
  });
});

export const freezeAccount = asyncHandler(async (req, res, next) => {
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      isDeleted: true,
      changePasswordTime: Date.now(),
    },
    { new: true }
  );

  return successHandler({
    res,
    status: 200,
    msg: "Done",
    data: { user },
  });
});

export const reActivateAccount = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  emailEvent.emit("sendEmail", { template: reactivateEmailTemplate, email });

  return successHandler({
    res,
    status: 200,
    msg: "Click the link in you mail to reactivate your account",
  });
});

export const reConfirmEmail = asyncHandler(async (req, res, next) => {
  const { authorization } = req.headers;

  const { email } = verifyToken({
    token: authorization,
    signature: process.env.EMAIL_SIGNATURE,
  });

  const user = await userModel
    .findOneAndUpdate(
      {
        email,
        isDeleted: true,
      },
      { isDeleted: false },
      { new: true }
    )
    .select("-password");

  user.phone = decodeEncryption({ cipherText: user.phone });

  successHandler({ res, status: 200, msg: "Done reconfirmed", data: { user } });
});

export const changeForgetenPassword = asyncHandler(async (req, res, next) => {
  const { OTP, newPassword } = req.body;
  const { authorization } = req.headers;

  const { email } = verifyToken({
    token: authorization,
    signature: process.env.EMAIL_SIGNATURE,
  });

  let user = await userModel.findOne({ email });
  if (!user) {
    return next(new Error("user not found", { cause: 404 }));
  }

  const match = compareHash({ plainText: OTP, hashValue: user.OTP });
  if (!match) {
    return next(new Error("Wrong OTP", { cause: 400 }));
  }
  const hashPassword = generateHash({ plainText: newPassword });

  user = await userModel.updateMany(
    { email },
    {
      password: hashPassword,
      changePasswordTime: Date.now(),
      OTP: null,
    }
  );

  successHandler({
    res,
    status: 200,
    msg: "password changed",
    data: { user },
  });
});
