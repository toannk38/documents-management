const nodemailer = require('nodemailer');
const { mail: mailConfig } = require('../config');

const transporter = nodemailer.createTransport(mailConfig);

const sendMail = async (options) => {
  return transporter.sendMail(options);
};

module.exports = {
  sendMail,
};
