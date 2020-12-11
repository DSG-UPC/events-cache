const getDeviceImpact = require("./getDeviceImpact")

function getDevicesImpact(devices) {
  let totalExtendedUsage = 0
  for (const device of devices) {
    const { extendedUsage } = getDeviceImpact(device.proofs)
    totalExtendedUsage += extendedUsage
  }
  return { totalExtendedUsage }
}

module.exports = getDevicesImpact
