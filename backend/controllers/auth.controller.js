const  User = require("../models/user.schema")
const asyncHandler = require("../services/asyncHandler")
const CustomError = require("../utils/customError")

//FIXME: Custom file
exports.cookieOptions = {
    expires: new Date(Date.now()+3*24*60*60*1000),
    httpOnly: true
} 

/******************************************************************************************
 * @signup
 * @route http://localhost:4000/api/auth/signup
 * @description User signup controller for registering new user
 * @returns User Object, Token
 ******************************************************************************************/

exports.signUp = asyncHandler(
    async (req, res)=>{
        const {name, email, password} = req.body
        if(!name || !email || !password){
            throw new CustomError("Please fill all the feilds", 400)
        }
        if((name && typeof(name)!=="string") || (email && typeof(email)!=="string") || (password && typeof(password)!=="string")){
            throw new CustomError("Field values should be of type string", 400)
        }
        const existingUser = await User.findOne({email})
        if(existingUser){
            throw new CustomError("User already exist", 400)
        }
        const user = await User.create({name, email, password})
        const token = user.getJwtToken() //FIXME: in models
        user.password = undefined
        res.cookie("token", token, cookieOptions)
        res.status(200).json({
            success: true,
            token,
            user
        })
    }
)

/******************************************************************************************
 * @login
 * @route http://localhost:4000/api/auth/login
 * @description User login controller for logging in user
 * @param email, password
 * @returns User Object, Token
 ******************************************************************************************/

exports.login = asyncHandler(
    async (req, res) => {
        const {email, password} = req.body
        if(!email || !password){
            throw new CustomError("Please fill all the feilds", 400)
        }
        if((email && typeof(email)!=="string") || (password && typeof(password)!=="string")){
            throw new CustomError("Field values should be of type string", 400)
        }
        const user = await User.findOne({email}).select("+password")
        if(!user || !(await user.comparePassword(password))){
            throw new CustomError("Invalid Credentials", 400)
        }
        const token = user.getJwtToken() //FIXME:
        user.password = undefined //FIXME: not required as it's a query
        res.status(200).json({
            success: true,
            token,
            user
        })
    }
)

/******************************************************************************************
 * @logout
 * @route http://localhost:4000/api/auth/login
 * @description User logout controller for logging out user by clearing user cookies
 * @returns message
 ******************************************************************************************/

exports.logout = asyncHandler(
    async (_req, res) => { //TODO: _req: Private, Not used in code block
        //FIXME: Clear cookie
        res.cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true
        })
        res.status(200).json({
            success: true,
            message: "User logged out successfully"
        })
    }
)

//FIXME: 
/**
 * Send mails: Nodemailer - Gmail (secure: true)
 * Test Email service - sendGrid, amazon SES, mailnator, mailtrp
 */