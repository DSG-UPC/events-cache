const sql = require("../../db")
const getDeviceProofs = require("./getDeviceProofs")

async function getUserDevices(userAddress) {
  const recycleDevices = (
    await sql.query(
      "select distinct deviceAddress from recycleproofs where useraddress = $1",
      [userAddress]
    )
  ).rows.map((device) => device.deviceaddress)
  const functionDevices = (
    await sql.query(
      "select distinct deviceAddress from functionproofs where useraddress = $1",
      [userAddress]
    )
  ).rows.map((device) => device.deviceaddress)
  const transferDevices = (
    await sql.query(
      "select distinct deviceAddress from transferproofs where receiveraddress = $1 or supplieraddress = $1",
      [userAddress]
    )
  ).rows.map((device) => device.deviceaddress)
  const datawipeDevices = (
    await sql.query(
      "select distinct deviceAddress from datawipeproofs where useraddress = $1",
      [userAddress]
    )
  ).rows.map((device) => device.deviceaddress)
  const reuseDevices = (
    await sql.query(
      "select distinct deviceAddress from reuseproofs where useraddress = $1",
      [userAddress]
    )
  ).rows.map((device) => device.deviceaddress)

  // dispositius en els que ha participat (amb una o més proofs) userAddress
  const deviceAddresses = [
    ...new Set([
      ...recycleDevices,
      ...functionDevices,
      ...transferDevices,
      ...datawipeDevices,
      ...reuseDevices,
    ]),
  ]

  const noData = deviceAddresses.length === 0

  const devices = []
  for (const deviceAddress of deviceAddresses) {
    const { proofs } = await getDeviceProofs(deviceAddress)
    devices.push({
      address: deviceAddress,
      proofs,
    })
  }

  return {
    noData,
    devices,
  }
}

module.exports = getUserDevices
