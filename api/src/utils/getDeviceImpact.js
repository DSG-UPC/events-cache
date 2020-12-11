function getDeviceImpact(proofs) {
  const functionproofs = proofs.functionproofs
  const firstUsage = functionproofs[0]?.diskusage || 0
  const extendedUsage =
    functionproofs[functionproofs.length - 1]?.diskusage - firstUsage || 0
  const lastScore = functionproofs[functionproofs.length - 1]?.score || 0

  // let proofsCount = {}
  // for (let proofstype in proofs) {
  //   const size = proofs[proofstype].length
  //   proofsCount[proofstype] = size
  // }

  return {
    firstUsage,
    extendedUsage,
    lastScore,
  }
}

module.exports = getDeviceImpact
