const express = require("express")
const ethers = require("ethers")
// const { BadRequest, NotFound } = require("../utils/errors")

const app = express()

app.post("/", async (req, res, next) => {
  const hash = req.body?.hash || "hha"
  try {
    const signer = new ethers.providers.JsonRpcProvider().getSigner()

    const stampProof = new ethers.Contract(
      "0xAE135bE1A8ab17aF2F92EdFb7Bf67d4e29623865",
      require("../../events/abi/StampProofs.json").abi,
      signer
    )

    stampProof.setProof(hash)
    res.json({
      status: "success",
    })
  } catch (error) {
    next(error)
  }
})

module.exports = app
