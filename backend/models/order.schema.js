const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
    products: {
        type: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: [true, "Please provide a product id"],
                },
                count: Number,
                price: Number
            }
        ],
        required: [true, "products are required to place order"] 
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, //FIXME: No types
        ref: "User",
        required: [true, "User Id is required to place order"]
    }, 
    phoneNumber: {
        type: Number,
        required: [true, "User phone number is required"]
    },
    address: {
        type: String,
        required: [true, "User address is required"]
    },
    amount: {
        type: Number,
        required: [true, "Order amount is required"]
    },
    coupon: String,
    transactionId: String,
    status: {
        type: String,
        enum: ["ORDERED", "SHIPPED", "OUT FOR DELIVERY","DELIVERED", "CANCELLED"],
        default: "ORDERED"
    } //FIXME: Make it better
}, 
{
    timestamps: true
})

module.exports = mongoose.model("Order", orderSchema)

//FIXME:
/**
 * Implementation:
 * paymentMode
 * Delivery Cost
 * Taxes
 * 
 * Learn:
 * Populate
 * Virtual 
 */ 