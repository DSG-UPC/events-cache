const ethers = require("ethers");
const express = require("express")
const bodyParser = require("body-parser")
// const addEventToCache = require("./event-router");
// const { stampProof, recycleProof, functionProof, transferProof, dataWipeProof, reuseProof } = require("./events")

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
  console.log("stampProof", data)
  addEventToCache(stampProof.name, data);
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
  addEventToCache(recycleProof.name, data)
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
  addEventToCache(functionProof.name, data)
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
  addEventToCache(transferProof.name, data)
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
  addEventToCache(dataWipeProof.name, data)
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
  addEventToCache(reuseProof.name, data)
});