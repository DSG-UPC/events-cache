const sql = require("../../db")
const getDeviceImpact = require("./getDeviceImpact")
const getUserImpact = require("./getUserImpact")

async function queryDevice(deviceAddress) {
  const device = (
    await sql.query("select * from devices where address = $1", [deviceAddress])
  ).rows

  if (device.length === 0) {
    return null
  }

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

  const proofs = {
    recycleproofs,
    functionproofs,
    transferproofs,
    datawipeproofs,
    reuseproofs,
  }
  return {
    address: deviceAddress,
    impact: getDeviceImpact(proofs),
    proofs,
  }
}

async function queryUser(userAddress) {
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

  if (deviceAddresses.length === 0) return null

  const devices = []
  for (const deviceAddress of deviceAddresses) {
    const device = await queryDevice(deviceAddress)
    if (!device) continue
    devices.push(device)
  }

  return {
    address: userAddress,
    impact: getUserImpact(devices),
    devices,
  }
}

module.exports = { queryDevice, queryUser }
