const express = require("express")
const ethers = require("ethers")
const pdf = require("html-pdf")
const ejs = require("ejs")
const path = require("path")
const { BadRequest, NotFound } = require("../utils/errors")

const { queryDevice, queryUser } = require("../utils/dbqueries")
const ejsHelpers = {
  getShortAddress: require("../utils/getShortAddress"),
}

require("dotenv").config()

const app = express()

/**
 * @swagger
 *
 * paths:
 *   /api/pdfs/devices/{deviceAddress}:
 *     get:
 *       parameters:
 *         - in: path
 *           name: deviceAddress
 *           required: true
 *           type: string
 *           description: Ethereum address.
 *       responses:
 *         200:
 *           description: Success
 *         400:
 *           description: Bad request
 *         404:
 *           description: Resource not found
 *         500:
 *           description: Internal error
 *
 */
app.get("/devices/:deviceAddress", async (req, res, next) => {
  try {
    const deviceAddress = req.params.deviceAddress

    if (!ethers.utils.isAddress(deviceAddress)) {
      throw new BadRequest("Wrong address")
    }

    const device = await queryDevice(deviceAddress)

    if (!device) throw new NotFound("Device not found")

    ejs.renderFile(
      path.join(__dirname, "../pdf/devicetemplate.ejs"),
      {
        device,
        validateUrl: `${process.env.FRONTENDURL}/?device=${deviceAddress}`,
        date: new Date().toGMTString(),
        helpers: ejsHelpers,
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

app.get("/users/:userAddress", async (req, res, next) => {
  try {
    const userAddress = req.params.userAddress

    if (!ethers.utils.isAddress(userAddress)) {
      throw new BadRequest("Wrong address")
    }

    const user = await queryUser(userAddress)

    if (!user) throw new NotFound("User not found")

    ejs.renderFile(
      path.join(__dirname, "../pdf/usertemplate.ejs"),
      {
        user,
        validateUrl: `${process.env.FRONTENDURL}/?device=${userAddress}`,
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
