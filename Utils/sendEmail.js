import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  // const transporter = nodemailer.createTransport({
  //   host: process.env.SMTP_HOST,
  //   port: process.env.SMTP_PORT,
  //   auth: {
  //     user: process.env.SMTP_EMAIL,
  //     pass: process.env.SMTP_PASSWORD,
  //   },
  // });
  var transporter = nodemailer.createTransport({
    service: "gmail",
    // host: 'smtp.gmail.com',
    auth: {
      user: "sridharsp4774@gmail.com",
      pass: "sRidhar621500067",
    },
  });
  const message = {
    from: "sridharsp4774@gmail.com",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  await transporter.sendMail(message);
};

export default sendEmail;
