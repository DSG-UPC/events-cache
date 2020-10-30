const ethers = require("ethers");
const express = require("express")
const bodyParser = require("body-parser")
const sql = require("./db");
const { stampProof, recycleProof, functionProof, transferProof, dataWipeProof, reuseProof } = require("./events")

// EXPRESS API
const app = express()
const port = 3001
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use((req, res, next) => { // alow CORS
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
app.use("/cache", require("./routes"))
app.listen(port, "127.0.0.1");

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
  
  sql.query("INSERT INTO stamps VALUES($1, $2, $3)",[data.id, data.hash, data.timestamp])
    .then(res => {console.log(`Inserted into stamps table: ${res.rowCount} row(s)`)})
    .catch(err => console.log("Insert failed: ", err.detail))
});

provider.on(recycleProof.filter, (log) => {
  const event = recycleProof.iface.parseLog(log).args;
  const data = {
    proofHash: event.proofHash.substring(2),
    recyclerAddress: event.recyclerAddress.substring(2),
    deviceAddress: event.deviceAddress.substring(2),
    date: event.date,
    gpsLocation: event.gpsLocation
  }
  console.log("recycleProof", data);

  sql.query("INSERT INTO recycleproofs (recyclerAddress, deviceAddress, proofhash, date, gpsLocation) VALUES ($1, $2, $3, $4, $5)",
    [data.recyclerAddress, data.deviceAddress, data.proofHash, data.date, data.gpsLocation])
    .then(res => {console.log(`Inserted into recycleproofs table: ${res.rowCount} row(s)`)})
    .catch(err => console.log("Insert failed: ", err.stack))
});

provider.on(functionProof.filter, (log) => {
  const event = functionProof.iface.parseLog(log).args;
  const data = {
    proofHash: event.proofHash.substring(2),
    ownerAddress: event.ownerAddress.substring(2),
    deviceAddress: event.deviceAddress.substring(2),
    score: event.score.toNumber(),
    diskUsage: event.diskUsage.toNumber(),
    algorithmVersion: event.algorithmVersion
  }
  console.log("functionProof", data)
  
  sql.query("INSERT INTO functionproofs (userAddress, deviceAddress, proofHash, score, diskUsage, algorithmVersion) VALUES ($1, $2, $3, $4, $5, $6)",
  [data.ownerAddress, data.deviceAddress, data.proofHash, data.score, data.diskUsage, data.algorithmVersion])
  .then(res => {console.log(`Inserted into functionproofs table: ${res.rowCount} row(s)`)})
  .catch(err => console.log("Insert failed: ", err.stack))
});

provider.on(transferProof.filter, (log) => {
  const event = transferProof.iface.parseLog(log).args;
  const data = {
    proofHash: event.proofHash.substring(2),
    deviceAddress: event.deviceAddress.substring(2),
    supplierAddress: event.supplier.substring(2),
    receiverAddress: event.receiver.substring(2)
  }
  console.log("transferProof", data)
  
  sql.query("INSERT INTO transferProofs (deviceAddress, supplierAddress, receiverAddress, proofHash) VALUES ($1, $2, $3, $4)",
    [data.deviceAddress, data.supplierAddress, data.receiverAddress, data.proofHash])
    .then(res => {console.log(`Inserted into transferproofs table: ${res.rowCount} row(s)`)})
    .catch(err => console.log("Insert failed: ", err.stack))
});

provider.on(dataWipeProof.filter, (log) => {
  const event = dataWipeProof.iface.parseLog(log).args;
  const data = {
    proofHash: event.proofHash.substring(2),
    deviceAddress: event.deviceAddress.substring(2),
    erasureType: event.erasureType,
    date: event.date,
    erasureResult: event.erasureResult
  }
  console.log("dataWipeProof", data);
  
  sql.query("INSERT INTO dataWipeProofs (deviceAddress, proofHash, erasureType, date, erasureResult) VALUES ($1, $2, $3, $4, $5)",
    [data.deviceAddress, data.proofHash, data.erasureType, data.date, data.erasureResult])
    .then(res => {console.log(`Inserted into datawipeproofs table: ${res.rowCount} row(s)`)})
    .catch(err => console.log("Insert failed: ", err.stack))
});

provider.on(reuseProof.filter, (log) => {
  const event = reuseProof.iface.parseLog(log).args;
  const data = {
    proofHash: event.proofHash.substring(2),
    deviceAddress: event.deviceAddress.substring(2),
    receiverSegment: event.receiverSegment,
    idReceipt: event.idReceipt,
    price: event.price.toNumber()
  };
  console.log("reuseProof", data);
  
  sql.query("INSERT INTO reuseproofs (deviceAddress, proofHash, receiverSegment, idReceipt, price) VALUES ($1, $2, $3, $4, $5)",
    [data.deviceAddress, data.proofHash, data.receiverSegment, data.idReceipt, data.price])
    .then(res => {console.log(`Inserted into reuseproofs table: ${res.rowCount} row(s)`)})
    .catch(err => console.log("Insert failed: ", err.stack))
});