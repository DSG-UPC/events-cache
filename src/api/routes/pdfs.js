const express = require("express")
const ethers = require("ethers")
const pdf = require("html-pdf")
const ejs = require("ejs")
const path = require("path")
const { BadRequest, NotFound } = require("../utils/errors")
const { getDeviceProofs } = require("../utils/getDeviceProofs")
require("dotenv").config()

const app = express()

app.get("/devices/:deviceAddress", async (req, res, next) => {
  try {
    const deviceAddress = req.params.deviceAddress

    if (!ethers.utils.isAddress(deviceAddress)) {
      throw new BadRequest("Wrong address")
    }

    const { noData, proofs } = await getDeviceProofs(deviceAddress)

    if (noData) throw new NotFound("Data not found for this device address")

    ejs.renderFile(
      path.join(__dirname, "../pdf/devicetemplate.ejs"),
      {
        deviceAddress,
        proofs,
        validateUrl: `${process.env.FRONTENDURL}/?device=${deviceAddress}`,
        date: new Date().toGMTString(),
      },
      (err, html) => {
        if (err) throw new Error("Error while rendering the ejs template")
        else {
          const options = {
            border: {
              top: "5mm",
              right: "10mm",
              bottom: "5mm",
              left: "10mm",
            },
            header: {
              height: "30mm",
            },
            footer: {
              height: "25mm",
            },
          }

          pdf.create(html, options).toBuffer((err, buffer) => {
            if (err) throw new Error("Error while creating the pdf")
            else {
              res.set({
                "Content-Type": "application/pdf",
                "Content-Length": buffer.length,
              })
              res.send(buffer)
            }
          })
        }
      }
    )
  } catch (e) {
    next(e)
  }
})

module.exports = app
