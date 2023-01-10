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
 * @returns User Object
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