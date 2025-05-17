import { EventEmitter } from "node:events";
import { generateEmailTemplate, sendEmail } from "../sendEmail/email.js";
import { generateToken } from "../Token/token.js";

export const emailEvent = new EventEmitter();

emailEvent.on("sendEmail", async (data) => {
  const { template, email } = data;

  const emailToken = generateToken({
    payLoad: { email },
    signature: process.env.EMAIL_SIGNATURE,
  });
  const emailLink = `${emailToken}`;
  const html = generateEmailTemplate(template, emailLink);
  await sendEmail({ to: email, subject: "Confirm Email", html });
});

emailEvent.on("sendOTP", async (data) => {
  const { template, email, otp } = data;
  // const html = generateEmailTemplate(template, otp);
  const text = `Use this code: ${otp}, to change your password`;
  await sendEmail({ to: email, subject: "forgot password", text });
});
