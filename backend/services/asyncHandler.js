const asyncHandler = (fn) => {
    return async (req, res, next) => {
        try {
            await fn(req, res, next) //FIXME: 4th param 
        } catch (error) {
            console.error("Error: ")
            console.error(error);
            res.status(err.code || 500).json({
                success: false,
                message: error.message
            })
        }
    }
}

export default asyncHandler;