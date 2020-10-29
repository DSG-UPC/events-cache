const network = require("./contracts/network.json");
const ethers = require("ethers");
const depositDeviceAbi = require("./contracts/DepositDevice.json").abi

module.exports = {
  stampProof: {
    name: "stampProof",
    iface: new ethers.utils.Interface(
      require("./contracts/StampProofs.json").abi
    ),
    filter: {
      // All stampProofs events from stampProof SC
      address: network.development.stampProofs,
      topics: [ethers.utils.id("stampProof(uint256,bytes32,uint256)")],
    },
  },
  recycleProof: {
    name: "recycleProof",
    iface: new ethers.utils.Interface(depositDeviceAbi),
    filter: {
      // All recycleProofs events from recycleProof SC
      topics: [ethers.utils.id("recycleProof(bytes32,address,address,string,string)")],
    },
  },


  functionProof: {
    name: "functionProof",
    iface: new ethers.utils.Interface(depositDeviceAbi),
    filter: {
      // All functionProofs events from functionProof SC
      topics: [
        ethers.utils.id("functionProof(bytes32,address,address,uint256,uint256,string)"),
      ],
    },
  },
  transferProof: {
    name: "transferProof",
    iface: new ethers.utils.Interface(depositDeviceAbi),
    filter: {
      // All transferProofs events from transferProof SC
      topics: [
        ethers.utils.id("transferProof(bytes32,address,address,address)"),
      ],
    },
  },
  dataWipeProof: {
    name: "dataWipeProof",
    iface: new ethers.utils.Interface(depositDeviceAbi),
    filter: {
      // All dataWipeProofs events from dataWipeProof SC
      topics: [
        ethers.utils.id("dataWipeProof(bytes32,address,string,string,bool)"),
      ],
    },
  },
  reuseProof: {
    name: "reuseProof",
    iface: new ethers.utils.Interface(depositDeviceAbi),
    filter: {
      // All dataWipeProofs events from reuseProof SC
      topics: [
        ethers.utils.id("reuseProof(bytes32,address,string,string,uint256)"),
      ],
    },
  },
};

