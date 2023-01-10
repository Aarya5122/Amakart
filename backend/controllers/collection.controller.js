const  Collection = require("../models/collection.schema")
const asyncHandler = require("../services/asyncHandler")
const CustomError = require("../utils/customError")


/******************************************************************************************
 * @CREATE_COLLECTION
 * @REQUEST_TYPE POST
 * @route http://localhost:4000/api/collection
 * @description Collection controller to create a collection
 * @param name
 * @returns newly created collection
 ******************************************************************************************/

exports.createCollection = asyncHandler(
    async (req, res) => {
        const {name} = req.body
        if(!name || typeof(name)!=="string"){
             throw new CustomError("Please provide collection name",400)
        }

        const collection = await Collection.create({name})
        res.status(200).json({
            success: true,
            message: "Collection created successfully",
            collection
        })
    }
)

/******************************************************************************************
 * @UPDATE_COLLECTION
 * @REQUEST_TYPE POST
 * @route http://localhost:4000/api/collection
 * @description Collection controller to update a collection
 * @param id
 * @returns updated collection
 ******************************************************************************************/

exports.updateCollection = asyncHandler(
    async (req, res) => {
        
        const {id: collectionId} = req.params
        if(!id){
            throw new CustomError("Please provide collection id",400)
        }

        const {name} = req.body
        if(!name || typeof(name)!=="string"){
             throw new CustomError("Please provide collection name",400)
        }

        const updatedCollection = await Collection.findByIdAndUpdate(id, {name}, {new: true, runValidators: true}) //FIXME:
     
        if(!updatedCollection){
            throw new CustomError("Collection not found", 400)
        }
     
        res.status(200).json({
            success: true,
            message: "Collection updated successfully",
            updatedCollection
        })

    }
)


/******************************************************************************************
 * @DELETE_COLLECTION
 * @REQUEST_TYPE DELETE
 * @route http://localhost:4000/api/collection
 * @description Collection controller to delete a collection
 * @param id
 * @returns deleted collection
 ******************************************************************************************/

exports.deleteCollection = asyncHandler(
    async (req, res) => {
        
        const {id: collectionId} = req.params
        if(!id){
            throw new CustomError("Please provide collection id",400)
        }

        const collectionToDelete = await Collection.findByIdAndDelete(id)

        if(!collectionToDelete){
            throw new CustomError("Collection not found", 400)
        }

        //FIXME: Delete variable --> delete variable or in mongoose collectionToDelete.remove() - optimization

        res.status(200).json({
            success: true,
            message: "Collection deleted successfully",
            collectionToDelete
        })
    }
)


/******************************************************************************************
 * @GET_COLLECTIONS
 * @REQUEST_TYPE GET
 * @route http://localhost:4000/api/collections
 * @description Collection controller to fetch all collections
 * @param 
 * @returns Collection Array
 ******************************************************************************************/

exports.getCollections = asyncHandler(
    async (_req, res) => {

        const collections = await Collection.find()

        if(!collections){
            throw new CustomError("No collection found", 400)
        }

        res.status(200).json({
            success: true,
            collections
        })
    }
)