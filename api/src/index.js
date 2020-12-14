const express = require("express")
const handleErrors = require("./middlewares/handleErrors")
const bodyParser = require("body-parser")

const host = process.env.API_HOST
const port = process.env.API_PORT

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
app.use("/api", require("./routes"))
app.use(handleErrors)

app.listen(port, host, () => {
  console.log(`Listening on http://${host}:${port}`)
})
