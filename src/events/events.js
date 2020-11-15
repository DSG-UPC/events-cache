const ethers = require("ethers")

module.exports = {
  recycleProof: {
    name: "recycleProof",
    filter: {
      topics: [ethers.utils.id("recycleProof(address,address,string)")],
    },
  },
  functionProof: {
    name: "functionProof",
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
    filter: {
      topics: [ethers.utils.id("transferProof(address,address,address)")],
    },
  },
  dataWipeProof: {
    name: "dataWipeProof",
    filter: {
      topics: [ethers.utils.id("dataWipeProof(address,address,string,bool)")],
    },
  },
  reuseProof: {
    name: "reuseProof",
    filter: {
      topics: [
        ethers.utils.id("reuseProof(address,address,string,string,uint256)"),
      ],
    },
  },
}
