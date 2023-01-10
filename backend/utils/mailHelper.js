const envConfig = require("../config/index")
const transporter = require("../config/transporter.config")

const mailHelper = async (options) => {
    const message = {
        from: envConfig.SMTP_MAIL_EMAIL, // sender address
        to: options.email, // list of receivers
        subject: options.subject, // Subject line
        text: options.text, // plain text body
        // html: "<b>Hello world?</b>", // html body
    }
    const info = await transporter.sendMail(message);
}

module.exports = mailHelper