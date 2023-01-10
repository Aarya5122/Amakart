const  User = require("../models/user.schema")
const asyncHandler = require("../services/asyncHandler")
const CustomError = require("../utils/customError")
const mailHelper = require("../utils/mailHelper")
const crypto = require("crypto")

//FIXME: Custom file
exports.cookieOptions = {
    expires: new Date(Date.now()+3*24*60*60*1000),
    httpOnly: true
} 

/******************************************************************************************
 * @SIGNUP
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
 * @LOGIN
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
 * @LOGOUT
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

/******************************************************************************************
 * @FORGOT_PASSWORD
 * @route http://localhost:4000/api/auth/password/forgot
 * @description User will send email and we will generate a token
 * @param email
 * @returns message - Email sent
 ******************************************************************************************/

exports.forgotPassword = asyncHandler(
    async (req, res) => { 
        const {email} = req.body
        if(!email || typeof(email)!=="string"){
            throw new CustomError("Please send a valid email address")
        }
        const user = await User.findOne({email})
        if(!user){
            throw new CustomError("User not found", 404)
        }
        const token = user.generateForgotPasswordToken()
        await user.save({validateBeforeSave: false}) //FIXME: All valdations should be available if only save()
        const resetURL = `${req.protocol}://${req.host}/api/auth/password/reset/${token}`
        try {
            mailHelper({
                email,
                subject: "Forgot password - Reset Password Link",
                text: 
                `
                    Please reset the link within 15 minutes of receiving email.
                    Link: ${resetURL}

                    Thank you
                `
            })
            res.status(200).json({
                success: true,
                message: `Email sent to ${email}`
            })
        } catch (error) {
            user.forgotPasswordToken = undefined
            user.forgotPasswordExpiry = undefined
            await user.save({validateBeforeSave: false})
            throw new CustomError(err.message || "Email sent failure", 500)
        }
    }
)

/******************************************************************************************
 * @RESET_PASSWORD
 * @route http://localhost:4000/api/auth/password/reset/:resetPasswordToken
 * @description User will send email and we will generate a token
 * @param token from url, password, confirm password
 * @returns User Object
 ******************************************************************************************/

exports.resetPassword = asyncHandler(
    async (req, res) => { 
        const {token: resetPasswordToken} = req.params
        
        if(!token || typeof(token)!=="string"){
            throw new CustomError("Please send a valid token")
        }

        const {password, confirmPassword} = req.body
        
        if(!password || typeof(password)!=="string" || !confirmPassword || typeof(confirmPassword)!=="string"){
            throw new CustomError("Please send a valid password and conform password value")
        }
        const encryptedToken = crypto.createHash("sha256").update(token).digest("hex")
        
        const user = await User.findOne({ //FIXME:
            forgotPasswordToken: encryptedToken,
            forgotPasswordExpiry: {$gt: Date.now()}
        })

        if(!user){
            throw new CustomError("Reset password token is invalid or expired", 400)
        }

        if(password!==confirmPassword){
            throw new CustomError("Password and Confirm Password does not match")
        }

        user.password = password
        user.forgotPasswordToken = undefined
        user.forgotPasswordExpiry = undefined

        await user.save({validateBeforeSave: false})

        user.password = undefined
        password = undefined
        confirmPassword = undefined

        const token = user.getJwtToken()
       
        res.cookie("token", token, cookieOptions)

        res.status(200).json({
            success: true,
            user
        })
    }
)

/******************************************************************************************
 * @CHANGE_PASSWORD
 * @route http://localhost:4000/api/auth/password/change
 * @description User will send email and we will generate a token
 * @param token from url, password, confirm password
 * @returns User Object
 ******************************************************************************************/

exports.changePassword = asyncHandler(
    async (req, res) => { 
        const {token: resetPasswordToken} = req.params
        
        if(!token || typeof(token)!=="string"){
            throw new CustomError("Please send a valid token")
        }

        const {password, confirmPassword} = req.body
        
        if(!password || typeof(password)!=="string" || !confirmPassword || typeof(confirmPassword)!=="string"){
            throw new CustomError("Please send a valid password and conform password value")
        }
        const encryptedToken = crypto.createHash("sha256").update(token).digest("hex")
        
        const user = await User.findOne({ //FIXME:
            forgotPasswordToken: encryptedToken,
            forgotPasswordExpiry: {$gt: Date.now()}
        })

        if(!user){
            throw new CustomError("Reset password token is invalid or expired", 400)
        }

        if(password!==confirmPassword){
            throw new CustomError("Password and Confirm Password does not match")
        }

        user.password = password
        user.forgotPasswordToken = undefined
        user.forgotPasswordExpiry = undefined

        await user.save({validateBeforeSave: false})

        user.password = undefined
        password = undefined
        confirmPassword = undefined

        const token = user.getJwtToken()
       
        res.cookie("token", token, cookieOptions)

        res.status(200).json({
            success: true,
            user
        })
    }
)


/******************************************************************************************
 * @GET_PROFILE
 * @REQUEST_TYPE GET
 * @route http://localhost:4000/api/auth/profile
 * @description Check for token and populate req.user
 * @param 
 * @returns User Object
 ******************************************************************************************/

exports.getProfile = asyncHandler(
    async (req, res) => { 
        const {user} = req
        if(!user){
            throw new CustomError("User not found", 404)
        }
        res.status(200).json({
            success: true,
            user
        })
    }
)