const db = require("./db");
const events = require("./events")

// const createUser = async (userAddress) => {
//     try {
//         db.query("INSERT INTO users VALUES ($1)", [userAddress])
//     } catch (e) {
//         console.log(e)
//     }
// }

// const createDevice = async (deviceAddress) => {
//   try {
//     db.query("INSERT INTO devices VALUES ($1)", [deviceAddress]);
//   } catch (e) {
//     console.log(e);
//   }
// };

// const userExists = async (userAddress) => {
//   let result = await db.query("SELECT address FROM users where address = $1", [
//     userAddress,
//   ]);
//   return result.rows.TAMANIO == 1;
// };

// const deviceExists = async (deviceAddress) => {
//   let result = await db.query("SELECT address FROM devices where address = $1", [
//     deviceAddress,
//   ]);
//   return result.rows.TAMANIO == 1;
// };

const saveStampProof = ({id, hash, timestamp}) => {
  db.query("INSERT INTO stamps VALUES($1, $2, $3)",[id, hash, timestamp])
    .then(res => {console.log(`Inserted into stamps table: ${res.rowCount} row(s)`)})
    // .catch(err => {console.error("Insert into stamps table FAILED:\n", err)})
    .catch(err => console.log("Insert failed: ", err.detail))
}


const saveRecycleProof = ({proofHash, recyclerAddress, deviceAddress, date, gpsLocation}) => {
  db.query("INSERT INTO recycleproofs (recyclerAddress, deviceAddress, proofhash, date, gpsLocation) VALUES ($1, $2, $3, $4, $5)",
    [recyclerAddress, deviceAddress, proofHash, date, gpsLocation])
    .then(res => {console.log(`Inserted into recycleproofs table: ${res.rowCount} row(s)`)})
    .catch(err => console.log("Insert failed: ", err.stack))
}

const saveFunctionProof = ({proofHash, ownerAddress, deviceAddress, score, diskUsage, algorithmVersion}) => {
  // if (!userExists(ownerAddress)) createUser(ownerAddress);
  // if (!deviceExists(deviceAddress)) createDevice(deviceAddress);
  db.query("INSERT INTO functionproofs (userAddress, deviceAddress, proofHash, score, diskUsage, algorithmVersion) VALUES ($1, $2, $3, $4, $5, $6)",
    [ownerAddress, deviceAddress, proofHash, score, diskUsage, algorithmVersion])
    .then(res => {console.log(`Inserted into functionproofs table: ${res.rowCount} row(s)`)})
    .catch(err => console.log("Insert failed: ", err.stack))
}

const saveTransferProof = ({proofHash, deviceAddress, supplierAddress, receiverAddress}) => {
  db.query("INSERT INTO transferProofs (deviceAddress, supplierAddress, receiverAddress, proofHash) VALUES ($1, $2, $3, $4)",
    [deviceAddress, supplierAddress, receiverAddress, proofHash])
    .then(res => {console.log(`Inserted into transferproofs table: ${res.rowCount} row(s)`)})
    .catch(err => console.log("Insert failed: ", err.stack))
}

const saveDataWipeProof = ({proofHash, deviceAddress, erasureType, date, erasureResult}) => {
  db.query("INSERT INTO dataWipeProofs (deviceAddress, proofHash, erasureType, date, erasureResult) VALUES ($1, $2, $3, $4, $5)",
    [deviceAddress, proofHash, erasureType, date, erasureResult])
    .then(res => {console.log(`Inserted into datawipeproofs table: ${res.rowCount} row(s)`)})
    .catch(err => console.log("Insert failed: ", err.stack))
}

const saveReuseProof = ({proofHash, deviceAddress, receiverSegment, idReceipt, price}) => {
  db.query("INSERT INTO reuseproofs (deviceAddress, proofHash, receiverSegment, idReceipt, price) VALUES ($1, $2, $3, $4, $5)",
    [deviceAddress, proofHash, receiverSegment, idReceipt, price])
    .then(res => {console.log(`Inserted into reuseproofs table: ${res.rowCount} row(s)`)})
    .catch(err => console.log("Insert failed: ", err.stack))
}

const addEventToCache = (event, data) => {
  switch (event) {
    case events.stampProof.name:
      saveStampProof(data)
      break
    case events.recycleProof.name:
      saveRecycleProof(data)
      break
    case events.functionProof.name:
      saveFunctionProof(data)
      break
    case events.transferProof.name:
      saveTransferProof(data)
      break
    case events.dataWipeProof.name:
      saveDataWipeProof(data)
      break
    case events.reuseProof.name:
      saveReuseProof(data)
      break
  }
};

module.exports = addEventToCache

        // db.query("INSERT INTO devices (address, lastUsageHours) VALUES($1, $2)\
        //         ON CONFLICT(address) DO UPDATE\
        //         SET lastUsageHours = devices.lastUsageHours + $2",