const User = require("../models/user.schema")
const asyncHandler = require("../services/asyncHandler")
const CustomError = require("../utils/customError")
const envConfig = require("../config/index")
const JWT = require("jsonwebtoken")

exports.isLoggedIn = asyncHandler(
    async (req, res, next)=>{
        let token;
        if( (req.cookies.token) || (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) ){
            token = req.cookies.token || req.headers.authorization.split(" ")[1]
        }
        if(!token){
            throw new CustomError("User is not authenticated", 401);
        }
        try {
            const decodedJwtPayload = JWT.verify(token, envConfig.JWT_TOKEN_SECRET)
            req.user = await User.findById(decodedJwtPayload._id, "name email role") //FIXME:
            next()
        } catch (error) {
            throw new CustomError("Not authorised to access this route", 401);
        }
    }
)