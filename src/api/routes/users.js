const express = require("express")
const ethers = require("ethers")
const { queryUser } = require("../utils/dbqueries")
const { BadRequest, NotFound } = require("../utils/errors")

const app = express()

app.get("/:userAddress", async (req, res, next) => {
  try {
    const userAddress = req.params.userAddress

    if (!ethers.utils.isAddress(userAddress)) {
      throw new BadRequest("Wrong address")
    }

    const user = await queryUser(userAddress)

    if (!user) throw new NotFound("User not found")

    return res.json({
      status: "success",
      data: {
        user,
      },
    })
  } catch (e) {
    next(e)
  }
})

module.exports = app
