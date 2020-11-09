const express = require("express");
const ethers = require("ethers");
const sql = require("../../db");

const { BadRequest, NotFound } = require("../utils/errors");

const app = express();

app.get("/:userAddress", async (req, res, next) => {
  try {
    const userAddress = req.params.userAddress;

    if (!ethers.utils.isAddress(userAddress)) {
      throw new BadRequest("Wrong address");
    }

    const recycleproofs = (
      await sql.query("select * from recycleproofs where useraddress = $1", [
        userAddress,
      ])
    ).rows;
    const functionproofs = (
      await sql.query("select * from functionproofs where useraddress = $1", [
        userAddress,
      ])
    ).rows;
    const transferproofs = (
      await sql.query(
        "select * from transferproofs where supplieraddress = $1 or receiveraddress = $1",
        [userAddress]
      )
    ).rows;
    const datawipeproofs = (
      await sql.query("select * from datawipeproofs where useraddress = $1", [
        userAddress,
      ])
    ).rows;
    const reuseproofs = (
      await sql.query("select * from reuseproofs where useraddress = $1", [
        userAddress,
      ])
    ).rows;

    const noData =
      recycleproofs.length === 0 &&
      functionproofs.length === 0 &&
      transferproofs.length === 0 &&
      datawipeproofs.length === 0 &&
      reuseproofs.length === 0;

    if (noData) throw new NotFound("Data not found for this device address");

    return res.json({
      status: "success",
      data: {
        user: {
          proofs: {
            recycleproofs,
            functionproofs,
            transferproofs,
            datawipeproofs,
            reuseproofs,
          },
        },
      },
    });
  } catch (e) {
    next(e);
  }
});

module.exports = app;
