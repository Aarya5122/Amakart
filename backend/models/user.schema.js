const mongoose = require("mongoose")
import AuthRoles from "../utils/authRoles"

// FIXME: new and import
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

module.exports = mongoose.model("user", UserSchema)