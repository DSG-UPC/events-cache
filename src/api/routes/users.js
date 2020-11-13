const express = require("express");
const ethers = require("ethers");
const sql = require("../../db");
const { getDeviceProofs } = require("../utils/getDeviceProofs");
const { BadRequest, NotFound } = require("../utils/errors");

const app = express();

app.get("/:userAddress", async (req, res, next) => {
  try {
    const userAddress = req.params.userAddress;

    if (!ethers.utils.isAddress(userAddress)) {
      throw new BadRequest("Wrong address");
    }


    const recycleDevices = (
      await sql.query("select distinct deviceAddress from recycleproofs where useraddress = $1", [
        userAddress,
      ])
    ).rows.map(device => device.deviceaddress);
    const functionDevices = (
      await sql.query(
        "select distinct deviceAddress from functionproofs where useraddress = $1",
        [userAddress]
      )
    ).rows.map((device) => device.deviceaddress);
    const transferDevices = (
      await sql.query(
        "select distinct deviceAddress from transferproofs where receiveraddress = $1 or supplieraddress = $1",
        [userAddress]
      )
    ).rows.map((device) => device.deviceaddress);
    const datawipeDevices = (
      await sql.query(
        "select distinct deviceAddress from datawipeproofs where useraddress = $1",
        [userAddress]
      )
    ).rows.map(device => device.deviceaddress);
    const reuseDevices = (
      await sql.query(
        "select distinct deviceAddress from reuseproofs where useraddress = $1",
        [userAddress]
      )
    ).rows.map(device => device.deviceaddress);

    //dispositius en els que ha participat (amb una o més proofs) userAddress
    let deviceAddresses = [...new Set([...recycleDevices, ...functionDevices, ...transferDevices, ...datawipeDevices, ...reuseDevices])]
    if (deviceAddresses.length === 0)
      throw new NotFound("Data not found for this user address");

    let devices = []
    for (deviceAddress of deviceAddresses) {
      const { proofs } = await getDeviceProofs(deviceAddress);
      devices.push({
        address: deviceAddress,
        proofs,
      })
    }

    return res.json({
      status: "success",
      data: {
        user: {
          devices
        },
      },
    });
  } catch (e) {
    next(e);
  }
});

module.exports = app;
