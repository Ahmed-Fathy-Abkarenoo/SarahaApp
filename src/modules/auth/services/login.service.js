import { asyncHandler } from "../../../utils/error/error.handling.js";
import userModel from "../../../DB/models/User.model.js";
import { successHandler } from "../../../utils/response/success.response.js";
import { generateToken } from "../../../utils/Token/token.js";
import { compareHash, generateHash } from "../../../utils/hash/hash.js";
import { roleTypes } from "../../../utils/constants/constants.js";
import { generateOTP } from "../../../utils/OTP/generateOTP.js";
import { emailEvent } from "../../../utils/Events/sendEmail.event.js";
import { otpTemplate } from "../../../utils/sendEmail/templates/otp.template.js";

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    return next(new Error("In-Valid login data", { cause: 404 }));
  }

  if (!user.confirmEmail) {
    return next(new Error("Please verify your Email first", { cause: 400 }));
  }

  const checkPass = compareHash({
    plainText: password,
    hashValue: user.password,
  });

  if (!checkPass) {
    return next(new Error("In-Valid login data", { cause: 404 }));
  }

  // user.isDeleted = false;
  // await user.save(); // easy method to reactivate the freeze account

  if (user.isDeleted) {
    return next(new Error("This Account is freezed", { cause: 400 }));
  } // hard method to reactivate the freeze account

  const token = generateToken({
    payLoad: { id: user._id, isLoggedIn: true },
    signature:
      user.role == roleTypes.user
        ? process.env.TOKEN_SIGNATURE
        : process.env.TOKEN_SIGNATURE_ADMIN,
    options: { expiresIn: "6h" },
  });

  return successHandler({
    res,
    status: 200,
    msg: "login successfully",
    data: token,
  });
});

export const forgotPasswordsendOTP = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    return next(new Error("In-Valid email", { cause: 404 }));
  }
  const otp = generateOTP();
  const hashOTP = generateHash({ plainText: otp });

  emailEvent.emit("sendOTP", { template: otpTemplate, email, otp });

  user.OTP = hashOTP;
  await user.save();

  const emailToken = generateToken({
    payLoad: { email },
    signature: process.env.EMAIL_SIGNATURE,
  });

  successHandler({
    res,
    satus: 200,
    msg: "otp sent",
    data: { emailToken },
  });
});
