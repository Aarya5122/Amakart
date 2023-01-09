const dotenv = require("dotenv")
dotenv.config()

const envConfig = {
    BCRYPT_PASSWORD_SALT: process.env.BCRYPT_PASSWORD_SALT,
    JWT_TOKEN_SECRET: process.env.JWT_TOKEN_SECRET,
    JWT_TOKEN_EXPIRY: process.env.JWT_TOKEN_EXPIRY ||" 1d",
    PORT: process.env.PORT,
    MONGODB_URL: process.env.MONGODB_URL
}

module.exports = envConfig