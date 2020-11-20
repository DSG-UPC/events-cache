const express = require("express")
const app = express()
const swaggerJsDocs = require("swagger-jsdoc")
const swaggerUI = require("swagger-ui-express")

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "eReuse API",
      version: "0.1.0",
    },
  },
  apis: ["src/api/routes/*.js"],
}

const swaggerDocs = swaggerJsDocs(swaggerOptions)

app.use("/devices", require("./devices"))
app.use("/users", require("./users"))
app.use("/stamps", require("./stamps"))
app.use("/pdfs", require("./pdfs"))
app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs))

module.exports = app
