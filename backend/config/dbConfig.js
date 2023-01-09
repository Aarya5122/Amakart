const mongoose = require("mongoose")
const envConfig = require(".") //FIXME: ./index
const app = require("../app")

const DBConnect = async () => {
    mongoose.set('strictQuery', false) //FIXME:
   try {
        await mongoose.connect(envConfig.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log("DB Connected successfully")

        //FIXME: Events in express !!!
        app.on("error", (error) => { //FIXME: Fatal error after connecting
            console.log("Error: ", err);
            throw error
        })

        app.listen(envConfig.PORT, ()=>console.log("Server is up and running in PORT: ", envConfig.PORT))

   }catch(error) {
        console.error("Error in connecting DB")
        console.error(error)
        process.exit(1)
        //TODO: throw error - kills execution
   }
}

module.exports =  DBConnect
