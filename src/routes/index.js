const express = require("express");
const app = express();

app.use("/devices",require("./devices"));
// app.use(require("./login"));
// app.use(require("./universities"));
// app.use(require("./degrees"));
// app.use(require("./posts"));
// app.use(require("./subjects"));
// app.use(require("./blockchain"));

module.exports = app;