const ethers = require("ethers")
const depositDeviceIface = new ethers.utils.Interface(
  require("./abi/DepositDevice.json").abi
)
const deviceFactoryIface = new ethers.utils.Interface(
  require("./abi/DeviceFactory.json").abi
)
const stampProofsIface = new ethers.utils.Interface(
  require("./abi/StampProofs.json").abi
)

module.exports = {
  stampProof: {
    name: "stampProof",
    iface: stampProofsIface,
    filter: {
      address: "0xAE135bE1A8ab17aF2F92EdFb7Bf67d4e29623865", // not necessary
      topics: [ethers.utils.id("stampProof(bytes32,uint256)")],
    },
  },
  deviceCreated: {
    name: "deviceCreated",
    iface: deviceFactoryIface,
    filter: {
      topics: [ethers.utils.id("DeviceCreated(address)")],
    },
  },
  recycleProof: {
    name: "recycleProof",
    iface: depositDeviceIface,
    filter: {
      topics: [ethers.utils.id("recycleProof(address,address,string)")],
    },
  },
  functionProof: {
    name: "functionProof",
    iface: depositDeviceIface,
    filter: {
      topics: [
        ethers.utils.id(
          "functionProof(address,address,uint256,uint256,string)"
        ),
      ],
    },
  },
  transferProof: {
    name: "transferProof",
    iface: depositDeviceIface,
    filter: {
      topics: [ethers.utils.id("transferProof(address,address,address)")],
    },
  },
  dataWipeProof: {
    name: "dataWipeProof",
    iface: depositDeviceIface,
    filter: {
      topics: [ethers.utils.id("dataWipeProof(address,address,string,bool)")],
    },
  },
  reuseProof: {
    name: "reuseProof",
    iface: depositDeviceIface,
    filter: {
      topics: [
        ethers.utils.id("reuseProof(address,address,string,string,uint256)"),
      ],
    },
  },
}
