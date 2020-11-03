const ethers = require("ethers");
const express = require("express");
const app = express();
const sql = require("../db");
const { BadRequest, NotFound } = require("../utils/errors");

app.get("/:deviceAddress", async (req, res, next) => {
  try {
    const deviceAddress = req.params.deviceAddress;

    if (!ethers.utils.isAddress(deviceAddress)) {
      throw new BadRequest("Wrong address");
    }

    const recycleproofs = (
      await sql.query("select * from recycleproofs where deviceaddress = $1", [
        deviceAddress,
      ])
    ).rows;
    const functionproofs = (
      await sql.query("select * from functionproofs where deviceaddress = $1", [
        deviceAddress,
      ])
    ).rows;
    const transferproofs = (
      await sql.query("select * from transferproofs where deviceaddress = $1", [
        deviceAddress,
      ])
    ).rows;
    const datawipeproofs = (
      await sql.query("select * from datawipeproofs where deviceaddress = $1", [
        deviceAddress,
      ])
    ).rows;
    const reuseproofs = (
      await sql.query("select * from reuseproofs where deviceaddress = $1", [
        deviceAddress,
      ])
    ).rows;

    const noData =
      recycleproofs.length === 0 &&
      functionproofs.length === 0 &&
      transferproofs.length === 0 &&
      datawipeproofs.length === 0 &&
      reuseproofs.length === 0;

    if (noData) throw new NotFound("Data not found for this device address")

    return res.json({
      status: "success",
      data: {
        proofs: {
          recycleproofs,
          functionproofs,
          transferproofs,
          datawipeproofs,
          reuseproofs,
        },
      },
    });
  } catch (e) {
    next(e);
  }
});

module.exports = app;
