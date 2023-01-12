const Product = require("../models/product.schema")
const formidable = require("formidable")
const fs = require("fs")  //FIXME: Node builtin module - file system module
const {S3FileUpload, S3FileDelete} = require("../services/fileUploader")
const mongoose = require("mongoose") //FIXME:
const asyncHandler = require("../services/asyncHandler")
const CustomError = require("../utils/customError")
const envConfig = require("../config/index")

/******************************************************************************************
 * @ADD_PRODUCT
 * @REQUEST_TYPE DELETE
 * @route http://localhost:4000/api/product
 * @description Controller used for creating a new product
 * @description Use AWS S3 Bucket for image upload
 * @description Only admins can create the coupon
 * @param
 * @returns Product Object
 ******************************************************************************************/

exports.addProduct = asyncHandler(
    async (req, res) => {
        
        const form = formidable({
            multiples: true,
            keepExtensions: true //FIXME: .png.php - hacker - handle it
        })

        form.parse(req, async function(error, fields, files){
            try {
                if(error){
                    throw new CustomError(err.message || "Something went wrong while adding product")
                }

                const productId = new mongoose.Types.ObjectId().toHexString()

                console.log("Fields: ",fields);//FIXME:
                console.log("Files: ",files);

                //FIXME:
                if(!fields.name || 
                   !fields.price ||
                   !fields.description,
                   !fields.collectionId){
                    throw new CustomError("Please fill all details", 500)
                }

                if(files){
                    let imgArrayResponse = Promise.all( //FIXME:
                        Object.keys(files).map(
                            async (fileKey, index) => {
                                const element = files[fileKey]
                                const data = fs.readFileSync(element.filepath)
                                const upload = await S3FileUpload({
                                    bucketName: envConfig.S3_BUCKET_NAME,
                                    key: `products/${productId}/photo_${index+1}.png`,
                                    body: data,
                                    contentType: element.mimetype
                                })
                                return {
                                    secure_url: upload.Location
                                }
                            }
                        )
                    )

                    let imgArray = await imgArrayResponse
                    const product = await Product.create({
                        _id: productId,
                        photos: imgArray,
                        ...fields
                    })

                    if(!product){
                        throw new CustomError("Product was not created", 400)
                        //FIXME: Delete images from cloud
                    }

                    res.status(200).json({
                        success: true,
                        product
                    })
                }


            } catch (error) {
                return res.status(500).json({
                    success: false,
                    message: error.message||"Something went wrong"
                })
            }
        })
    }
)

/******************************************************************************************
 * @ADD_PRODUCT
 * @REQUEST_TYPE DELETE
 * @route http://localhost:4000/api/product
 * @description Controller used for creating a new product
 * @description Use AWS S3 Bucket for image upload
 * @description Only admins can create the coupon
 * @param
 * @returns Product Object
 ******************************************************************************************/

exports.addProduct = asyncHandler(
    async (req, res) => {
        
    }
)