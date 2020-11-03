const express = require("express");
const app = express();

app.use("/devices",require("./devices"));
// app.use("/users", require("./users"));
// app.use("/data", require("./data"));
// app.use(require("./universities"));
// app.use(require("./degrees"));
// app.use(require("./posts"));
// app.use(require("./subjects"));
// app.use(require("./blockchain"));

module.exports = app;