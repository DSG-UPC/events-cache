const express = require("express")
const app = express()

app.use("/devices", require("./devices"))
app.use("/users", require("./users"))
app.use("/stamp", require("./stamp"))
app.use("/pdf", require("./pdf"))

module.exports = app
