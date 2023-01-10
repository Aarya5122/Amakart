const dotenv = require("dotenv")
dotenv.config()

const envConfig = {
    BCRYPT_PASSWORD_SALT: process.env.BCRYPT_PASSWORD_SALT,
    JWT_TOKEN_SECRET: process.env.JWT_TOKEN_SECRET,
    JWT_TOKEN_EXPIRY: process.env.JWT_TOKEN_EXPIRY ||" 1d",
    PORT: process.env.PORT,
    MONGODB_URL: process.env.MONGODB_URL,
    SMTP_MAIL_HOST: process.env. SMTP_MAIL_HOST,
    SMTP_MAIL_PORT: process.env. SMTP_MAIL_PORT,
    SMTP_MAIL_USERNAME: process.env. SMTP_MAIL_USERNAME,
    SMTP_MAIL_PASSWORD: process.env. SMTP_MAIL_PASSWORD,
    SMTP_MAIL_EMAIL: process.env.SMTP_MAIL_EMAIL,
    S3_ACCESS_KEY: process.env.S3_ACCESS_KEY,
    S3_SECRET_KEY: process.env.S3_SECRET_KEY,
    S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
    S3_REGION: process.env.S3_REGION,
}

module.exports = envConfig