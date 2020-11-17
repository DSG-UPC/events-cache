const express = require("express")
const ethers = require("ethers")
const nodemailer = require("nodemailer")
const { BadRequest } = require("../utils/errors")

const app = express()

const iface = new ethers.utils.Interface(
  require("../../events/abi/StampProofs.json").abi
)

const isValidSHA3 = (hash) => {
  if (typeof hash !== "string") return false
  return hash.match("^[a-fA-F0-9]{64}$")
}
const isValidToken = (token) => {
  if (typeof token !== "string") return false
  return true
}
const isValidEmail = (email) => {
  if (typeof email !== "string") return false
  return true
}

const sendEmail = async (email, hash, token) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "",
      pass: "",
    },
  })

  const mailOptions = {
    from: "eReuse blockchain", // sender address
    to: email, // list of receivers
    subject: "Report Stamped ✔", // Subject line
    html: `<h3>Your report has been stamped</h3><p>You used token 0x${token}.</p><p>Visit <a href="http://localhost:3000/check-stamps">our website</a> to check the stamp.</p>`, // html body
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
  const token = req.body.token
  const email = req.body.email
  console.log(hash)
  try {
    if (!isValidSHA3(hash)) throw new BadRequest("Invalid Hash")
    if (!isValidToken(token)) throw new BadRequest("Invalid Token")
    if (!isValidEmail(email)) throw new BadRequest("Invalid Email")

    const signer = new ethers.providers.JsonRpcProvider().getSigner()
    const stampProof = new ethers.Contract(
      "0xAE135bE1A8ab17aF2F92EdFb7Bf67d4e29623865",
      require("../../events/abi/StampProofs.json").abi,
      signer
    )

    stampProof.setProof(`0x${hash}`)

    const r = sendEmail(email, hash, token)

    res.json({
      status: r ? "success" : "error",
    })
  } catch (error) {
    next(error)
  }
})

app.post("/check", async (req, res, next) => {
  const hash = req.body.hash
  console.log(hash)
  try {
    if (!isValidSHA3(hash)) throw new BadRequest("Invalid Hash")
    const provider = new ethers.providers.JsonRpcProvider()
    const logs = await provider.getLogs({
      fromBlock: 0,
      topics: [
        ethers.utils.id("stampProof(bytes32,uint256)"),
        ethers.utils.hexZeroPad(`0x${hash}`),
      ],
    })

    console.log(logs)

    if (logs.length === 0)
      throw new BadRequest("No stamps found for this document")

    let index = 0
    const events = logs.map((log) => {
      ++index
      const event = iface.parseLog(log).args
      return {
        i: index,
        hash: event.hash.substring(2),
        date: new Date(event.timestamp.toNumber() * 1000),
      }
    })

    res.json({
      status: "success",
      data: {
        events,
      },
    })
  } catch (error) {
    next(error)
  }
})

module.exports = app
