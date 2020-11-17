const express = require("express")
const ethers = require("ethers")
const pdf = require("html-pdf")
const ejs = require("ejs")
const path = require("path")
const signer = require("node-signpdf")
const fs = require("fs")

const { BadRequest, NotFound } = require("../utils/errors")
const { getDeviceProofs } = require("../utils/getDeviceProofs")

const app = express()

app.get("/devices/:deviceAddress", async (req, res, next) => {
  try {
    const deviceAddress = req.params.deviceAddress

    if (!ethers.utils.isAddress(deviceAddress)) {
      throw new BadRequest("Wrong address")
    }

    const { noData, proofs } = await getDeviceProofs(deviceAddress)

    if (noData) throw new NotFound("Data not found for this device address")

    // const ejspdf = await ejs.renderFile(
    //   path.join(__dirname, "../pdf/template.ejs"),
    //   {
    //     deviceAddress,
    //     proofs,
    //   }
    // )

    // const options = {
    //   height: "11.25in",
    //   width: "8.5in",
    //   border: {
    //     top: "5mm",
    //     right: "10mm",
    //     bottom: "5mm",
    //     left: "10mm",
    //   },
    //   header: {
    //     height: "45mm",
    //   },
    //   footer: {
    //     height: "20mm",
    //   },
    // }

    // pdf.create(ejspdf, options).toBuffer((err, buffer) => {
    //   if (err) console.log(err)
    //   res.writeHead(200, {
    //     "Content-Type": "application/pdf",
    //     "Content-Length": buffer.length,
    //   })
    //   res.end(buffer)
    // })

    ejs.renderFile(
      path.join(__dirname, "../pdf/template.ejs"),
      { deviceAddress, proofs },
      (err, ejsFile) => {
        if (err) throw new Error("error while rendering the ejs template")
        else {
          const options = {
            height: "11.25in",
            width: "8.5in",
            border: {
              top: "5mm",
              right: "10mm",
              bottom: "5mm",
              left: "10mm",
            },
            header: {
              height: "45mm",
            },
            footer: {
              height: "20mm",
            },
          }

          pdf.create(ejsFile, options).toBuffer((err, buffer) => {
            if (err) throw new Error("error while creating the pdf")
            else {
              // const p12Buffer = fs.readFileSync(
              //   path.join(__dirname, "../pdf/keyStore.p12")
              // )
              // const signPdf = new signer.SignPdf()
              // console.log(signPdf)

              // signPdf.sign(buffer, p12Buffer)
              // const signature = signPdf.lastSignature
              // console.log(signature)

              // res.writeHead(200, {
              //   "Content-Type": "application/pdf",
              //   "Content-Length": buffer.length,
              // })
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
