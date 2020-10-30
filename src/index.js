const ethers = require("ethers");
// const { addEventToCache } = require("./event-router");
const { stampProof, recycleProof, functionProof, transferProof, dataWipeProof, reuseProof } = require("./events")

const provider = new ethers.providers.JsonRpcProvider();

// provider.resetEventsBlock(0);

provider.on(stampProof.filter, log => {
  const event = stampProof.iface.parseLog(log).args
  const data = {
    id: event.id.toNumber(),
    hash: event.hash,
    timestamp: event.timestamp.toNumber()
  }
  console.log("stampProof", data)
  // addEventToCache(stampProof.name, {
    //     id: Number(id),
    //     hash: hash.slice(2),
    //     timestamp: Number(timestamp)
    // });
});

provider.on(recycleProof.filter, (log) => {
  const event = recycleProof.iface.parseLog(log).args;
  const data = {
    proofHash: event.proofHash,
    recyclerAddress: event.recyclerAddress,
    deviceAddress: event.deviceAddress,
    date: event.date,
    gpsLocation: event.gpsLocation
  }
  console.log("recycleProof", data);
  
  // addEventToCache(stampProof.name, {
  //     id: Number(id),
  //     hash: hash.slice(2),
  //     timestamp: Number(timestamp)
  // });
});

provider.on(functionProof.filter, (log) => {
  const event = functionProof.iface.parseLog(log).args;
  const data = {
    proofHash: event.proofHash,
    ownerAddress: event.ownerAddress,
    deviceAddress: event.deviceAddress,
    score: event.score.toNumber(),
    diskUsage: event.diskUsage.toNumber(),
    algorithmversion: event.algorithmversion
  }
  console.log("functionProof", data)
});

provider.on(transferProof.filter, (log) => {
  const event = transferProof.iface.parseLog(log).args;
  const data = {
    proofHash: event.proofHash,
    deviceAddress: event.deviceAddress,
    supplierAddress: event.supplier,
    receiverAddress: event.receiver
  }
  console.log("transferProof", data)
});

provider.on(dataWipeProof.filter, (log) => {
  const event = dataWipeProof.iface.parseLog(log).args;
  const data = {
    proofHash: event.proofHash,
    deviceAddress: event.deviceAddress,
    erasureType: event.erasureType,
    date: event.date,
    erasureResult: event.erasureResult
  }
  console.log("dataWipeProof", data);
});

provider.on(reuseProof.filter, (log) => {
  const event = reuseProof.iface.parseLog(log).args;
  const data = {
    proofHash: event.proofHash,
    deviceAddress: event.deviceAddress,
    receiverSegment: event.receiverSegment,
    idReceipt: event.idReceipt,
    price: event.price.toNumber()
  };
  console.log("reuseProof", data);
});