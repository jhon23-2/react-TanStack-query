const express = require("express")
const app = express()
const sequelize = require("./config/database")
const morgan = require("morgan")
const cors = require("cors")
const taskRouters = require("./routers/router")

require("dotenv").config()


const PORT = process.env.PORT || 5000


// Middler wares configuration 

app.use(express.json())
app.disable("x-powered-by")
app.use(morgan("dev"))
app.use(cors({
  origin: "*"
}))


// endpoints for Task
app.use("/api/task", taskRouters)

// function init server 

const initFunction = async () => {
  try {
    // run file database.js with configuration for to check everything is in place 
    await sequelize.authenticate();
    console.log("Database has been connected ✅")

    // Sync Orm with database schemes 
    await sequelize.sync({ alter: true })
    console.log("Model Task syncronized to datasabe succesfully 🫡")

    app.listen(PORT, () => {
      console.log(`Server Listening on port ${PORT} 🦻`)
    })
  } catch (error) {
    console.error("Something was wrong ⛔️ " + error)
  }
}

initFunction()