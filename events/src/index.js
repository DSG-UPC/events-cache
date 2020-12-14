const ethers = require("ethers")
const sql = require("./db")
const {
  recycleProof,
  functionProof,
  transferProof,
  dataWipeProof,
  reuseProof,
  deviceCreated,
  stampProof,
} = require("./events")

const provider = new ethers.providers.JsonRpcProvider(
  process.env.BLOCKCHAIN_ENDPOINT
)

console.log(process.env.BLOCKCHAIN_ENDPOINT)

provider
  .getNetwork()
  .then((network) => {
    console.log("> Network: ", network)
    console.log(
      `> Listening to events from blockchain at ${process.env.BLOCKCHAIN_ENDPOINT}`
    )

    if (process.env.BLOCKCHAIN_RESET === "true") {
      console.log("> Starting from: block 0\n")
      provider.resetEventsBlock(0)
    } else console.log("> Starting from: last block\n")
  })
  .catch((err) => {
    console.log(err)
    process.exit(1)
  })

provider.on(stampProof.filter, (log) => {
  const event = stampProof.iface.parseLog(log).args
  const data = {
    hash: event.hash.substring(2),
    timestamp: event.timestamp.toNumber(),
  }

  sql
    .query("INSERT INTO stamps VALUES($1, $2)", [data.hash, data.timestamp])
    .then((res) => {
      console.log("stampProof: ", data)
      console.log(`Inserted into stamps table: ${res.rowCount} row(s)`, "\n")
    })
    .catch((err) => {
      console.log("stampProof", data)
      console.log("Insert failed: ", err.detail, "\n")
    })
})

provider.on(deviceCreated.filter, (log) => {
  const event = deviceCreated.iface.parseLog(log).args
  const deviceAddress = event._deviceAddress.substring(2)

  sql
    .query("INSERT INTO devices VALUES($1)", [deviceAddress])
    .then((res) => {
      console.log("DeviceCreated: ", deviceAddress)
      console.log(`Inserted into Devices table: ${res.rowCount} row(s)`, "\n")
    })
    .catch((err) => {
      console.log("DeviceCreated: ", deviceAddress)
      console.log("Insert failed: ", err.detail, "\n")
    })
})

provider.on(recycleProof.filter, (log) => {
  const event = recycleProof.iface.parseLog(log).args
  const data = {
    userAddress: event.userAddress.substring(2),
    deviceAddress: event.deviceAddress.substring(2),
    date: event.date,
    block: log.blockNumber,
  }

  sql
    .query("INSERT INTO recycleproofs VALUES ($1, $2, $3)", [
      data.block,
      data.userAddress,
      data.deviceAddress,
    ])
    .then((res) => {
      console.log("recycleProof", data)
      console.log(
        `Inserted into recycleproofs table: ${res.rowCount} row(s)`,
        "\n"
      )
    })
    .catch((err) => {
      console.log("recycleProof", data)
      console.log("Insert failed: ", err.detail, "\n")
    })
})

provider.on(functionProof.filter, (log) => {
  const event = functionProof.iface.parseLog(log).args
  const data = {
    userAddress: event.userAddress.substring(2),
    deviceAddress: event.deviceAddress.substring(2),
    score: event.score.toNumber(),
    diskUsage: event.diskUsage.toNumber(),
    algorithmVersion: event.algorithmVersion,
    block: log.blockNumber,
  }

  sql
    .query("INSERT INTO functionproofs VALUES ($1, $2, $3, $4, $5, $6)", [
      data.block,
      data.userAddress,
      data.deviceAddress,
      data.score,
      data.diskUsage,
      data.algorithmVersion,
    ])
    .then((res) => {
      console.log("functionProof", data)
      console.log(
        `Inserted into functionproofs table: ${res.rowCount} row(s)`,
        "\n"
      )
    })
    .catch((err) => {
      console.log("functionProof", data)
      console.log("Insert failed: ", err.detail, "\n")
    })
})

provider.on(transferProof.filter, (log) => {
  const event = transferProof.iface.parseLog(log).args
  const data = {
    deviceAddress: event.deviceAddress.substring(2),
    supplierAddress: event.supplierAddress.substring(2),
    receiverAddress: event.receiverAddress.substring(2),
    block: log.blockNumber,
  }

  sql
    .query("INSERT INTO transferProofs VALUES ($1, $2, $3, $4)", [
      data.block,
      data.supplierAddress,
      data.receiverAddress,
      data.deviceAddress,
    ])
    .then((res) => {
      console.log("transferProof", data)
      console.log(
        `Inserted into transferproofs table: ${res.rowCount} row(s)`,
        "\n"
      )
    })
    .catch((err) => {
      console.log("transferProof", data)
      console.log("Insert failed: ", err.detail, "\n")
    })
})

provider.on(dataWipeProof.filter, (log) => {
  const event = dataWipeProof.iface.parseLog(log).args
  const data = {
    userAddress: event.userAddress.substring(2),
    deviceAddress: event.deviceAddress.substring(2),
    erasureType: event.erasureType,
    erasureResult: event.erasureResult,
    block: log.blockNumber,
  }

  sql
    .query("INSERT INTO dataWipeProofs VALUES ($1, $2, $3, $4, $5)", [
      data.block,
      data.userAddress,
      data.deviceAddress,
      data.erasureType,
      data.erasureResult,
    ])
    .then((res) => {
      console.log("dataWipeProof", data)
      console.log(
        `Inserted into datawipeproofs table: ${res.rowCount} row(s)`,
        "\n"
      )
    })
    .catch((err) => {
      console.log("dataWipeProof", data)
      console.log("Insert failed: ", err.detail, "\n")
    })
})

provider.on(reuseProof.filter, (log) => {
  const event = reuseProof.iface.parseLog(log).args
  const data = {
    userAddress: event.userAddress.substring(2),
    deviceAddress: event.deviceAddress.substring(2),
    receiverSegment: event.receiverSegment,
    idReceipt: event.idReceipt,
    price: event.price.toNumber(),
    block: log.blockNumber,
  }

  sql
    .query("INSERT INTO reuseproofs VALUES ($1, $2, $3, $4, $5, $6)", [
      data.block,
      data.userAddress,
      data.deviceAddress,
      data.receiverSegment,
      data.idReceipt,
      data.price,
    ])
    .then((res) => {
      console.log("reuseProof", data)
      console.log(
        `Inserted into reuseproofs table: ${res.rowCount} row(s)`,
        "\n"
      )
    })
    .catch((err) => {
      console.log("reuseProof", data)
      console.log("Insert failed: ", err.detail, "\n")
    })
})
