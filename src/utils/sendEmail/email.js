import nodemailer from "nodemailer";

export const generateEmailTemplate = (fn, emailLink) => {
  return fn(emailLink);
};

export const sendEmail = async ({
  to = [],
  cc = "",
  bcc = "",
  subject = "Confirm-Email",
  text = "",
  html = "",
  attachments = [],
} = {}) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MASTER_EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: `"Saraha App" <${process.env.MASTER_EMAIL}>`,
    to,
    cc,
    bcc,
    subject,
    text,
    html,
    attachments,
  });

  // console.log("Message sent: %s", info.messageId);

  return info;
};
