const ethers = require("ethers")
require("dotenv").config()

const depositDeviceIface = new ethers.utils.Interface(
  require("./blockchain/abi/DepositDevice.json").abi
)
const deviceFactoryIface = new ethers.utils.Interface(
  require("./blockchain/abi/DeviceFactory.json").abi
)
const stampProofsIface = new ethers.utils.Interface(
  require("./blockchain/abi/StampProofs.json").abi
)

const STAMPPROOFS_ADDRESS = process.env.STAMPPROOFS_ADDRESS

// Events objects. Each object is an event. It contains the interface of the smart contract that emits that event and a filter to catch it from index.js.
module.exports = {
  stampProof: {
    name: "stampProof",
    iface: stampProofsIface,
    filter: {
      address: STAMPPROOFS_ADDRESS, // not necessary
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
