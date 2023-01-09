const mongoose = require("mongoose")
const envConfig = require(".") //FIXME: ./index

const DBConnect = async () => {
    mongoose.set('strictQuery', false) //FIXME:
    mongoose.connect(envConfig.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(()=>{
        console.log("DB Connected successfully")
    }).catch((error)=>{
        console.error("Error in connecting DB")
        console.error(error)
        process.exit(1)
    })
}

module.exports =  DBConnect