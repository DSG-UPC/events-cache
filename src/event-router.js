const db = require("./db");

var Events;
(function (Events) {
  Events["stampProof"] = "stampProof";
  Events["functionProof"] = "functionProof";
  Events["transferProof"] = "transferProof";
  Events["dataWipeProof"] = "dataWipeProof";
  Events["reuseProof"] = "reuseProof";
  Events["recycleProof"] = "recycleProof";
})(Events || (Events = {}));

const stampProof = async (id, hash, timestamp) => {
    try {
        db.query(
            "INSERT INTO stamps VALUES($1, $2, $3)",
            [id, hash, timestamp],
            (err, res) => {
                if (err) console.error(`Couldn't insert ${id} into DB`);
                else console.log(id + ": " + hash);
            }
        );
    } catch (e) {
        console.log("error: ", e);
    }
}

const functionProof = async (deviceAddress, diskUsage) => {
    try {
        let exists = await db.query("SELECT address FROM devices WHERE address = $1", [deviceAddress])
            .then((res) => res.rows.length != 0)
            .catch((e) => console.log(e.stack))
        if (!exists) db.query("INSERT INTO devices (address, lastUsageHours) VALUES($1, $2)", [deviceAddress, diskUsage])
        else db.query("UPDATE devices SET lastUsageHours = lastUsageHours + $2 WHERE address = $1", [deviceAddress, diskUsage])
    } catch (e) {
        console.log(e)
    }
}

const addEventToCache = async (event, data) => {
    switch (event) {
        case Events.stampProof:
            stampProof(data.id, data.hash, data.timestamp)
            break
        case Events.functionProof:
            functionProof(data.deviceAddress, data.diskUsage)
            break
    }
};

module.exports = { addEventToCache }