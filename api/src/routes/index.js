const express = require("express")
const app = express()

app.use("/devices", require("./devices"))
app.use("/users", require("./users"))
app.use("/stamps", require("./stamps"))

module.exports = app
