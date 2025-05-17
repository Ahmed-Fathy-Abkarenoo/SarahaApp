export const otpTemplate = (otp) => {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>OTP</title>
  </head>
  <body>
      <div style="width: 100px; height: 100px; background-color: lightgray; text-align: center;">
          <h1>OTP</h1>
          <h3>${otp}</h3>
      </div>
  </body>
  </html>`;
};
