const express = require("express")
const handleErrors = require("./middlewares/handleErrors")
require("dotenv").config()

const port = process.env.APIPORT
const url = process.env.APIURL
const app = express()
app.use((req, res, next) => {
  // allow CORS
  res.header("Access-Control-Allow-Origin", "*")
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  )
  next()
})
app.use("/cache", require("./routes"))
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
