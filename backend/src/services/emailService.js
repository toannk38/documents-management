const nodemailer = require('nodemailer');
const { mail: mailConfig } = require('../config');

const transporter = nodemailer.createTransport(mailConfig);

const sendMail = async (options) => {
  return transporter.sendMail(options);
};

async function sendResetPasswordEmail(email, token) {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
  await sendMail({
    to: email,
    subject: 'Reset your password',
    html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 1 hour.</p>`
  });
}

module.exports = {
  sendMail,
  sendResetPasswordEmail,
};
