const ethers = require("ethers");
const sql = require("../db");
const {
  recycleProof,
  functionProof,
  transferProof,
  dataWipeProof,
  reuseProof,
} = require("./events");
require("dotenv").config();

const bcurl = process.env.BCURL;
const bcport = process.env.BCPORT;

const provider = new ethers.providers.JsonRpcProvider(
  `http://${bcurl}:${bcport}`
);
const iface = new ethers.utils.Interface(
  require("./abi/DepositDevice.json").abi
);

provider
  .getNetwork()
  .then((network) => {
    console.log("> Network: ", network);
    console.log(`> Listening to events from blockchain at ${bcurl}:${bcport}`);

    if (process.env.BCRESET === "true") {
      console.log("> Starting from block 0\n");
      provider.resetEventsBlock(0);
    } else console.log("> Starting from last block\n");
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });

provider.on(recycleProof.filter, (log) => {
  const event = iface.parseLog(log).args;
  const data = {
    userAddress: event.userAddress.substring(2),
    deviceAddress: event.deviceAddress.substring(2),
    date: event.date,
    block: log.blockNumber,
  };

  sql
    .query("INSERT INTO recycleproofs VALUES ($1, $2, $3)", [
      data.userAddress,
      data.deviceAddress,
      data.block,
    ])
    .then((res) => {
      console.log(`Inserted into recycleproofs table: ${res.rowCount} row(s)`);
      console.log("recycleProof", data, "\n");
    })
    .catch((err) => {
      console.log("Insert failed: ", err.detail)
      console.log("recycleProof", data, "\n");
    });
});

provider.on(functionProof.filter, (log) => {
  const event = iface.parseLog(log).args;
  const data = {
    userAddress: event.userAddress.substring(2),
    deviceAddress: event.deviceAddress.substring(2),
    score: event.score.toNumber(),
    diskUsage: event.diskUsage.toNumber(),
    algorithmVersion: event.algorithmVersion,
    block: log.blockNumber,
  };

  sql
    .query("INSERT INTO functionproofs VALUES ($1, $2, $3, $4, $5, $6)", [
      data.userAddress,
      data.deviceAddress,
      data.block,
      data.score,
      data.diskUsage,
      data.algorithmVersion,
    ])
    .then((res) => {
      console.log(`Inserted into functionproofs table: ${res.rowCount} row(s)`);
      console.log("functionProof", data, "\n");
    })
    .catch((err) => {
      console.log("Insert failed: ", err.detail)
      console.log("functionProof", data, "\n");
    });
});

provider.on(transferProof.filter, (log) => {
  const event = iface.parseLog(log).args;
  const data = {
    deviceAddress: event.deviceAddress.substring(2),
    supplierAddress: event.supplierAddress.substring(2),
    receiverAddress: event.receiverAddress.substring(2),
    block: log.blockNumber,
  };

  sql
    .query("INSERT INTO transferProofs VALUES ($1, $2, $3, $4)", [
      data.supplierAddress,
      data.receiverAddress,
      data.deviceAddress,
      data.block,
    ])
    .then((res) => {
      console.log(`Inserted into transferproofs table: ${res.rowCount} row(s)`);
      console.log("transferProof", data, "\n");
    })
    .catch((err) => {
      console.log("Insert failed: ", err.detail)
      console.log("transferProof", data, "\n");
    });
});

provider.on(dataWipeProof.filter, (log) => {
  const event = iface.parseLog(log).args;
  const data = {
    userAddress: event.userAddress.substring(2),
    deviceAddress: event.deviceAddress.substring(2),
    erasureType: event.erasureType,
    erasureResult: event.erasureResult,
    block: log.blockNumber,
  };

  sql
    .query("INSERT INTO dataWipeProofs VALUES ($1, $2, $3, $4, $5)", [
      data.userAddress,
      data.deviceAddress,
      data.block,
      data.erasureType,
      data.erasureResult,
    ])
    .then((res) => {
      console.log(`Inserted into datawipeproofs table: ${res.rowCount} row(s)`);
      console.log("dataWipeProof", data, "\n");
    })
    .catch((err) => {
      console.log("Insert failed: ", err.detail)
      console.log("dataWipeProof", data, "\n");
    });
});

provider.on(reuseProof.filter, (log) => {
  const event = iface.parseLog(log).args;
  const data = {
    userAddress: event.userAddress.substring(2),
    deviceAddress: event.deviceAddress.substring(2),
    receiverSegment: event.receiverSegment,
    idReceipt: event.idReceipt,
    price: event.price.toNumber(),
    block: log.blockNumber,
  };

  sql
    .query("INSERT INTO reuseproofs VALUES ($1, $2, $3, $4, $5, $6)", [
      data.userAddress,
      data.deviceAddress,
      data.block,
      data.receiverSegment,
      data.idReceipt,
      data.price,
    ])
    .then((res) => {
      console.log(`Inserted into reuseproofs table: ${res.rowCount} row(s)`);
      console.log("reuseProof", data, "\n");
    })
    .catch((err) => {
      console.log("Insert failed: ", err.detail)
      console.log("reuseProof", data, "\n");
    });
});
