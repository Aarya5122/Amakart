const AWS = require("aws-sdk")
const envConfig = require("./index")

const S3 = new AWS.S3({
    accessKeyId: envConfig.S3_ACCESS_KEY,
    secretAccessKey: envConfig.S3_SECRET_KEY,
    region: envConfig.S3_REGION
})

module.exports = S3