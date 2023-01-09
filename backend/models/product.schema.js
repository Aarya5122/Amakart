const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a product name"],
        trim: true,
        maxLength: [120, "Product name should be maximum of 120 charecters"]
    },
    price: {
        type: Number,
        required: [true, "Please provide a product priec"],
        maxLength: [6, "Product price should not be more than of 6 digits"]
    },
    description: {
        type: String
        //TODO: Use editor assignment
    },
    photos: [{
        secure_url: {
            type: String,
            required: [true, "Please provide image URL"]
        }
    }],
    stocks: {
        type: Number,
        default: 0
    },
    sold: {
        type: Number,
        default: 0
    },
    collectionId: {
        type: mongoose.Schema.Types.ObjectId, //FIXME:
        ref: "Collection" //FIXME:
    }
}, 
{
    timestamps: true
})

module.exports = mongoose.model("Product", productSchema)

//FIXME: 
/**
 * Assignments
 * Mark Down implementation for description
 * Review: ratings + comments
 */