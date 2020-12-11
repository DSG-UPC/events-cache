const getShortAddress = (address) => {
  const beginning =
    address.substring(0, 2) === "0x"
      ? address.substring(2, 6)
      : "0x" + address.substring(0, 4)
  const end = address.substring(address.length - 5, address.length - 1)
  return "0x" + beginning + "..." + end
}

module.exports = getShortAddress
