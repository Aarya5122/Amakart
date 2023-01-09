import mongoose from "mongoose"
import AuthRoles from "../utils/authRoles"
import JWT from "jsonwebtoken"
import crypto from "crypto"
import bcrypt from "bcrypt"
import envConfig from "../config"
import {envConfigDes} from "../config"

// FIXME: new and import, export, DESENV
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
        select: false //FIXME:
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
    
    //TODO: this.modified("key") TODO:
    if(!this.modified("password")){
        return next();
    }
    this.password = await bcrypt.hash(this.password, envConfigDes.BCRYPT_PASSWORD_SALT) //FIXME: await
    next()

})

//FIXME: Mongoose Schema Methods

UserSchema.methods = {
    comparePassword: async function(enteredPassword){
        return await bcrypt.compare(enteredPassword, this.password) //TODO: Boolean is returned
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
    }
}

export default mongoose.model("User", UserSchema)