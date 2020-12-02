const express = require("express")
const ethers = require("ethers")
const nodemailer = require("nodemailer")
const { BadRequest, NotFound } = require("../utils/errors")
const { stampProof } = require("../../events/events")
require("dotenv").config()

const app = express()

const iface = new ethers.utils.Interface(
  require("../../events/abi/StampProofs.json").abi
)

const isValidSHA3 = (hash) => {
  if (typeof hash !== "string") return false
  return hash.match("^[a-fA-F0-9]{64}$")
}
const isValidURL = (url) => {
  if (typeof url !== "string") return false
  return true
}
const isValidEmail = (email) => {
  if (typeof email !== "string") return false
  return true
}

const sendEmail = async (email, hash, timestamp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  })

  const mailOptions = {
    from: "eReuse blockchain", // sender address
    to: email, // list of receivers
    subject: "Report Stamped ✔", // Subject line
    html: `<h3>Your report has been stamped</h3><p>hash: ${hash}, timestamp: ${timestamp}</p>`, // html body
  }
  try {
    const info = await transporter.sendMail(mailOptions)
    console.log("Message sent: %s", info.messageId)
    return true
  } catch (e) {
    return false
  }
}

app.post("/create", async (req, res, next) => {
  const hash = req.body.hash
  const url = req.body.url
  const email = req.body.email
  try {
    if (!isValidSHA3(hash)) throw new BadRequest("Invalid Hash")
    if (!isValidURL(url)) throw new BadRequest("Invalid Verification URL")
    if (!isValidEmail(email)) throw new BadRequest("Invalid Email")

    const provider = new ethers.providers.JsonRpcProvider()
    await provider.getNetwork() // Stops if ethereum network not detected
    const signer = provider.getSigner()
    const stampProofsContract = new ethers.Contract(
      stampProof.filter.address,
      require("../../events/abi/StampProofs.json").abi,
      signer
    )

    stampProofsContract.setProof(`0x${hash}`)

    // Stop execution until stampProof event detected. TODO: make asynchronous
    provider.once(
      {
        address: "0xAE135bE1A8ab17aF2F92EdFb7Bf67d4e29623865",
        topics: [
          ethers.utils.id("stampProof(bytes32,uint256)"),
          ethers.utils.hexZeroPad(`0x${hash}`),
        ],
      },
      async (log) => {
        const event = stampProof.iface.parseLog(log).args
        const emailSent = await sendEmail(
          email,
          event.hash,
          event.timestamp.toNumber()
        )

        res.json({
          status: "success",
          data: {
            hash: event.hash,
            timestamp: event.timestamp.toNumber(),
            emailSent: emailSent ? "success" : "error",
          },
        })
      }
    )
  } catch (error) {
    next(error)
  }
})

app.post("/check", async (req, res, next) => {
  const hash = req.body.hash
  try {
    if (!isValidSHA3(hash)) throw new BadRequest("Invalid Hash")

    const provider = new ethers.providers.JsonRpcProvider()
    await provider.getNetwork() // Stops if ethereum network not detected
    const logs = await provider.getLogs({
      fromBlock: 0,
      topics: [
        ethers.utils.id("stampProof(bytes32,uint256)"),
        ethers.utils.hexZeroPad(`0x${hash}`),
      ],
    })

    if (logs.length === 0)
      throw new NotFound("No stamps found for this document")

    // let index = 0
    const stamps = logs.map((log) => {
      // ++index
      const event = iface.parseLog(log).args
      return {
        // i: index,
        hash: event.hash.substring(2),
        date: new Date(event.timestamp.toNumber() * 1000),
      }
    })

    res.json({
      status: "success",
      data: {
        stamps,
      },
    })
  } catch (error) {
    next(error)
  }
})

module.exports = app
