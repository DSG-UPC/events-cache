const getShortAddress = require("../../src/utils/getShortAddress")

test("compact an address string", () => {
  const address = "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7"
  const shortAddress = getShortAddress(address)
  expect(shortAddress).toBe("0x8920...c43e")
})
