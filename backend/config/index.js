import dotenv from "dotenv"
dotenv.config()

//FIXME: Destructuring
const envConfig = {
    BCRYPT_PASSWORD_SALT: process.env.BCRYPT_PASSWORD_SALT,
    JWT_TOKEN_SECRET: process.env.JWT_TOKEN_SECRET,
    JWT_TOKEN_EXPIRY: process.env.JWT_TOKEN_EXPIRY ||" 1d"
}

export const envConfigDes = {
    ...process.env
}

export default envConfig

//FIXME: Import and export as express