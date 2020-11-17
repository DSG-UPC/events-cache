const express = require("express")
const handleErrors = require("./middlewares/handleErrors")
const bodyParser = require("body-parser")
require("dotenv").config()

const port = process.env.APIPORT
const url = process.env.APIURL
const app = express()
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
app.use((req, res, next) => {
  // allow CORS
  res.header("Access-Control-Allow-Origin", "*")
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  )
  next()
})
// app.use(cors())
app.use("/api", require("./routes"))
app.use(handleErrors)

const server = app.listen(port, url, () => {
  console.log(`Listening on ${url}:${port}`)
})

process.on("SIGTERM", () => {
  server.close(() => {
    console.log("\nProcess terminated")
  })
})

process.on("SIGINT", () => {
  server.close(() => {
    console.log("\nProcess terminated")
  })
})
