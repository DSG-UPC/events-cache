const network = require("./contracts/network.json");
const ethers = require("ethers");
const depositDeviceAbi = require("./contracts/DepositDevice.json").abi;

module.exports = {
  stampProof: {
    name: "stampProof",
    iface: new ethers.utils.Interface(
      require("./contracts/StampProofs.json").abi
    ),
    filter: {
      address: network.development.stampProofs,
      topics: [ethers.utils.id("stampProof(bytes32,uint256)")],
    },
  },
  recycleProof: {
    name: "recycleProof",
    iface: new ethers.utils.Interface(depositDeviceAbi),
    filter: {
      topics: [
        ethers.utils.id("recycleProof(address,address,string)"),
      ],
    },
  },
  functionProof: {
    name: "functionProof",
    iface: new ethers.utils.Interface(depositDeviceAbi),
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
    iface: new ethers.utils.Interface(depositDeviceAbi),
    filter: {
      topics: [
        ethers.utils.id("transferProof(address,address,address)"),
      ],
    },
  },
  dataWipeProof: {
    name: "dataWipeProof",
    iface: new ethers.utils.Interface(depositDeviceAbi),
    filter: {
      topics: [
        ethers.utils.id("dataWipeProof(address,address,string,bool)"),
      ],
    },
  },
  reuseProof: {
    name: "reuseProof",
    iface: new ethers.utils.Interface(depositDeviceAbi),
    filter: {
      topics: [
        ethers.utils.id("reuseProof(address,address,string,string,uint256)"),
      ],
    },
  },
};
