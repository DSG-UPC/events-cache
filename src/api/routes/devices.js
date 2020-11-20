const express = require("express")
const ethers = require("ethers")
const { BadRequest, NotFound } = require("../utils/errors")
const { queryDevice } = require("../utils/dbqueries")

const app = express()

/**
 * @swagger
 *
 * paths:
 *   /api/devices/{deviceAddress}:
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
app.get("/:deviceAddress", async (req, res, next) => {
  try {
    const deviceAddress = req.params.deviceAddress

    if (!ethers.utils.isAddress(deviceAddress)) {
      throw new BadRequest("Wrong address")
    }

    const device = await queryDevice(deviceAddress)

    if (!device) throw new NotFound("Device not found")

    return res.json({
      status: "success",
      data: {
        device,
      },
    })
  } catch (e) {
    next(e)
  }
})

module.exports = app
