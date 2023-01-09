const mongoose = require("mongoose")

const collectionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a category name for product"],
        trim: true,
        maxLength: [120, "Collection name should be more than 120 charecters"]
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("Collection", collectionSchema)