const S3 = require("../config/s3.config")

/**
 * bucketName:Name of container
 * key: Name Collision
 * body: File
 * contentType: Type of file
 */
exports.S3FileUpload = async ({bucketName, key, body, contentType}) => {
    Array.isArray([1,2])

    return await S3.upload({
        Bucket: bucketName,
        Key: key,
        Body: body,
        ContentType: contentType
    }).promise() //FIXME:
}


exports.S3FileDelete = async ({bucketName, key}) => {
    return await S3.deleteObject({
        Bucket: bucketName,
        Key: key,
    }).promise()
}