const nodemailer = require("nodemailer")
const envConfig = require(".")
;
const transporter = nodemailer.createTransport({
    host: envConfig.SMTP_MAIL_HOST,
    port: envConfig.SMTP_MAIL_PORT,
    secure: false, //FIXME: Study
    auth: {
      user: envConfig.SMTP_MAIL_USERNAME, 
      pass: envConfig.SMTP_MAIL_PASSWORD, 
    },
  });

module.exports = transporter