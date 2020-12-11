const sql = require("../db")
const getDeviceImpact = require("./getDeviceImpact")
const getDevicesImpact = require("./getDevicesImpact")

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
  // Proofs count
  const recycleProofs = +(
    await sql.query(
      "select count(*) from recycleproofs where useraddress = $1",
      [userAddress]
    )
  ).rows[0].count
  const functionProofs = +(
    await sql.query(
      "select count(*) from functionproofs where useraddress = $1",
      [userAddress]
    )
  ).rows[0].count
  const transferProofs = +(
    await sql.query(
      "select count(*) from transferproofs where receiveraddress = $1 or supplieraddress = $1",
      [userAddress]
    )
  ).rows[0].count
  const datawipeProofs = +(
    await sql.query(
      "select count(*) from datawipeproofs where useraddress = $1",
      [userAddress]
    )
  ).rows[0].count
  const reuseProofs = +(
    await sql.query("select count(*) from reuseproofs where useraddress = $1", [
      userAddress,
    ])
  ).rows[0].count
  const proofs = {
    total:
      recycleProofs +
      functionProofs +
      transferProofs +
      datawipeProofs +
      reuseProofs,
    recycleProofs,
    functionProofs,
    transferProofs,
    datawipeProofs,
    reuseProofs,
  }

  // Devices
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
    proofs,
    impact: getDevicesImpact(devices),
    devices,
  }
}

async function queryAll() {
  // Proofs count
  const recycleProofs = +(await sql.query("select count(*) from recycleproofs"))
    .rows[0].count
  const functionProofs = +(
    await sql.query("select count(*) from functionproofs")
  ).rows[0].count
  const transferProofs = +(
    await sql.query("select count(*) from transferproofs")
  ).rows[0].count
  const datawipeProofs = +(
    await sql.query("select count(*) from datawipeproofs")
  ).rows[0].count
  const reuseProofs = +(await sql.query("select count(*) from reuseproofs"))
    .rows[0].count
  const proofs = {
    total:
      recycleProofs +
      functionProofs +
      transferProofs +
      datawipeProofs +
      reuseProofs,
    recycleProofs,
    functionProofs,
    transferProofs,
    datawipeProofs,
    reuseProofs,
  }

  // Devices
  const deviceAddresses = (
    await sql.query("select address from devices")
  ).rows.map((device) => device.address)

  if (deviceAddresses.length === 0) return null

  const devices = []
  for (const deviceAddress of deviceAddresses) {
    const device = await queryDevice(deviceAddress)
    if (!device) continue
    devices.push(device)
  }

  return {
    addresses: deviceAddresses,
    proofs,
    impact: getDevicesImpact(devices),
    devices,
  }
}

async function queryStamp(hash) {
  // hash is a 64 char string (without 0x prefix)
  const stamps = (
    await sql.query("select * from stamps where hash = $1", [hash])
  ).rows.map((stamp) => {
    return {
      hash: stamp.hash,
      date: new Date(stamp.timestamp * 1000),
    }
  })
  return stamps
}

module.exports = { queryDevice, queryUser, queryAll, queryStamp }
