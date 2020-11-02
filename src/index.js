const ethers = require("ethers");
const express = require("express");
const bodyParser = require("body-parser");
const sql = require("./db");
const {
  stampProof,
  recycleProof,
  functionProof,
  transferProof,
  dataWipeProof,
  reuseProof,
} = require("./events");

// EXPRESS API
// const app = express();
// const port = 3000;
// app.use((req, res, next) => {
//   // alow CORS
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });
// app.use("/cache", require("./routes"));
// app.listen(port, "127.0.0.1");

// BLOCKCHAIN EVENT SUBSCRIPTION
const provider = new ethers.providers.JsonRpcProvider();
// provider.resetEventsBlock(0);
provider.on(stampProof.filter, log => {
  const event = stampProof.iface.parseLog(log).args
  const data = {
    id: event.id.toNumber(),
    hash: event.hash.substring(2),
    timestamp: event.timestamp.toNumber()
  }
  console.log("stampProof", data);

  sql.query("INSERT INTO stamps VALUES($1, $2, $3)",[data.id, data.hash, data.timestamp])
    .then(res => {console.log(`Inserted into stamps table: ${res.rowCount} row(s)`)})
    .catch(err => console.log("Insert failed: ", err.detail))
});

provider.on(recycleProof.filter, (log) => {
  const event = recycleProof.iface.parseLog(log).args;
  const data = {
    userAddress: event.userAddress.substring(2),
    deviceAddress: event.deviceAddress.substring(2),
    date: event.date,
    block: log.blockNumber
  }
  console.log("recycleProof", data);

  sql.query("INSERT INTO recycleproofs (userAddress, deviceAddress, block) VALUES ($1, $2, $3)",
    [data.userAddress, data.deviceAddress, data.block])
    .then(res => {console.log(`Inserted into recycleproofs table: ${res.rowCount} row(s)`)})
    .catch(err => console.log("Insert failed: ", err.stack))
});

provider.on(functionProof.filter, (log) => {
  const event = functionProof.iface.parseLog(log).args;
  const data = {
    userAddress: event.userAddress.substring(2),
    deviceAddress: event.deviceAddress.substring(2),
    score: event.score.toNumber(),
    diskUsage: event.diskUsage.toNumber(),
    algorithmVersion: event.algorithmVersion,
    block: log.blockNumber
  }
  console.log("functionProof", data)

  sql.query("INSERT INTO functionproofs (userAddress, deviceAddress, score, diskUsage, algorithmVersion, block) VALUES ($1, $2, $3, $4, $5, $6)",
  [data.userAddress, data.deviceAddress, data.score, data.diskUsage, data.algorithmVersion, data.block])
  .then(res => {console.log(`Inserted into functionproofs table: ${res.rowCount} row(s)`)})
  .catch(err => console.log("Insert failed: ", err.stack))
});

provider.on(transferProof.filter, (log) => {
  const event = transferProof.iface.parseLog(log).args;
  const data = {
    deviceAddress: event.deviceAddress.substring(2),
    supplierAddress: event.supplierAddress.substring(2),
    receiverAddress: event.receiverAddress.substring(2),
    block: log.blockNumber
  }
  console.log("transferProof", data)

  sql
    .query(
      "INSERT INTO transferProofs (supplierAddress, receiverAddress, deviceAddress, block) VALUES ($1, $2, $3, $4)",
      [
        data.supplierAddress,
        data.receiverAddress,
        data.deviceAddress,
        data.block,
      ]
    )
    .then((res) => {
      console.log(`Inserted into transferproofs table: ${res.rowCount} row(s)`);
    })
    .catch((err) => console.log("Insert failed: ", err.stack));
});

provider.on(dataWipeProof.filter, (log) => {
  const event = dataWipeProof.iface.parseLog(log).args;
  const data = {
    userAddress: event.userAddress.substring(2),
    deviceAddress: event.deviceAddress.substring(2),
    erasureType: event.erasureType,
    erasureResult: event.erasureResult,
    block: log.blockNumber
  };
  console.log("dataWipeProof", data);

  sql
    .query(
      "INSERT INTO dataWipeProofs (userAddress, deviceAddress, erasureType, erasureResult, block) VALUES ($1, $2, $3, $4, $5)",
      [
        data.userAddress,
        data.deviceAddress,
        data.erasureType,
        data.erasureResult,
        data.block
      ]
    )
    .then((res) => {
      console.log(`Inserted into datawipeproofs table: ${res.rowCount} row(s)`);
    })
    .catch((err) => console.log("Insert failed: ", err.stack));
});

provider.on(reuseProof.filter, (log) => {
  const event = reuseProof.iface.parseLog(log).args;
  const data = {
    userAddress: event.userAddress.substring(2),
    deviceAddress: event.deviceAddress.substring(2),
    receiverSegment: event.receiverSegment,
    idReceipt: event.idReceipt,
    price: event.price.toNumber(),
    block: log.blockNumber
  };
  console.log("reuseProof", data);

  sql.query("INSERT INTO reuseproofs (userAddress, deviceAddress, receiverSegment, idReceipt, price, block) VALUES ($1, $2, $3, $4, $5, $6)",
    [data.userAddress, data.deviceAddress, data.receiverSegment, data.idReceipt, data.price, data.block])
    .then(res => {console.log(`Inserted into reuseproofs table: ${res.rowCount} row(s)`)})
    .catch(err => console.log("Insert failed: ", err.stack))
});
