const express = require("express")
const app = express()

const cookieParser = require("cookie-parser")
const cors = require("cors") //FIXME:
const morgan = require("morgan") //FIXME: Winston complex setup

app.use(express.urlencoded({extended: true})) //FIXME:
app.use(express.json())
app.use(cors()) //Proper URL or pattern not *
app.use(cookieParser())
app.use(morgan("tiny")) //FIXME: Prints info about api req and res. combined(X) tiny(✅)


module.exports = app