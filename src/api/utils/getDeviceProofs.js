const sql = require("../../db")

async function getDeviceProofs(deviceAddress) {
  const recycleproofs = (
    await sql.query("select * from recycleproofs where deviceaddress = $1", [
      deviceAddress,
    ])
  ).rows
  const functionproofs = (
    await sql.query("select * from functionproofs where deviceaddress = $1", [
      deviceAddress,
    ])
  ).rows
  const transferproofs = (
    await sql.query("select * from transferproofs where deviceaddress = $1", [
      deviceAddress,
    ])
  ).rows
  const datawipeproofs = (
    await sql.query("select * from datawipeproofs where deviceaddress = $1", [
      deviceAddress,
    ])
  ).rows
  const reuseproofs = (
    await sql.query("select * from reuseproofs where deviceaddress = $1", [
      deviceAddress,
    ])
  ).rows

  const noData =
    recycleproofs.length === 0 &&
    functionproofs.length === 0 &&
    transferproofs.length === 0 &&
    datawipeproofs.length === 0 &&
    reuseproofs.length === 0

  return {
    noData,
    proofs: {
      recycleproofs,
      functionproofs,
      transferproofs,
      datawipeproofs,
      reuseproofs,
    },
  }
}

module.exports = { getDeviceProofs }
