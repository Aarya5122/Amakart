const mongoose = require("mongoose")
const AuthRoles = require("../utils/authRoles")
const JWT = require("jsonwebtoken")
const crypto = require("crypto") //FIXME:
const bcrypt = require("bcrypt")
const envConfig = require("../config")

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        maxLength: [40, "Number of characters should be less than 40 charecters"],
        trim: true
    }, 
    email: {
        type: String,
        require: [true, "Email is required"],
        //FIXME: regexr.com for regex
        unique: [true, "Email already exist"], //FIXME: Not validator - Unique Indexing
        trim: true
    },
    password: {
        type: String,
        require: [true, "Password is required"],
        minLength: [8, "Password length must be atleast of 8 charecters"],
        select: false //FIXME: Updated
    },
    role: {
        type: String,
        enum: Object.values(AuthRoles), //TODO: Array of values - Dynamic - Future proofing,
        default: AuthRoles.USER
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
}, 
{timestamps: true}) //FIXME: Timeseries - createdAt UpdatedAt

//FIXME: Mongoose Hooks - pre, post, error - middleware functions

UserSchema.pre("save", async function(next){ //TODO: use function statements
    
    //TODO: this.isModified("key") TODO:
    if(!this.isModified("password")){
        return next();
    }
    this.password = await bcrypt.hash(this.password, Number(envConfig.BCRYPT_PASSWORD_SALT))
    next()

})

//FIXME: Mongoose Schema Methods

UserSchema.methods = {
    comparePassword: async function(enteredPassword){
        return await bcrypt.compare(enteredPassword, this.password) //TODO: Promise is returned
    },
    getJwtToken: function(){
        //FIXME: this
        return JWT.sign({
            _id: this._id,
            role: this.role
        },
        envConfig.JWT_TOKEN_SECRET,
        {
            expiresIn: envConfig.JWT_TOKEN_EXPIRY
        })
    },
    generateForgotPasswordToken: function(){
        const forgotPasswordToken = crypto.randomBytes(20).toString("hex")
        this.forgotPasswordToken = crypto.createHash("sha256").update(forgotPasswordToken).digest("hex")
        this.forgotPasswordExpiry = Date.now()+(20*60*1000)
        return forgotPasswordToken
    }
}

module.exports = mongoose.model("User", UserSchema)

//FIXME:
// JWT n Forgot Password testing
/*
    Model enhancement:
        Status - Restrict the authorization
*/