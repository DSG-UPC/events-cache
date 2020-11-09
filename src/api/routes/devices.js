const express = require("express");
const ethers = require("ethers");
// const sql = require("../../db");
const {getDeviceProofs} = require("../utils/getDeviceProofs")

const { BadRequest, NotFound } = require("../utils/errors");

const app = express();

app.get("/:deviceAddress", async (req, res, next) => {
  try {
    const deviceAddress = req.params.deviceAddress;

    if (!ethers.utils.isAddress(deviceAddress)) {
      throw new BadRequest("Wrong address");
    }

    const {noData, proofs} = await getDeviceProofs(deviceAddress)

    if (noData) throw new NotFound("Data not found for this device address");

    return res.json({
      status: "success",
      data: {
        device: {
          proofs
        },
      },
    });
  } catch (e) {
    next(e);
  }
});

module.exports = app;