const express = require("express");
const app = express();
const sql = require("../db")

app.get("/:deviceAddress", async (req, res, next) => {
    const deviceAddress = req.params.deviceAddress
    try {
        const response = await sql.query("select * from recycleproofs where deviceaddress = $1", [deviceAddress])
        console.log(response.rows)
        res.send({
            response: n
        })

    } catch (e) {
        console.log(e)
        next()
    }
})

module.exports = app