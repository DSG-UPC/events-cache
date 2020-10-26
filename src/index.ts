const ethers = require ("ethers");
const Network = require("./contracts/network.json");
// const db = require("./db");

const provider = new ethers.providers.JsonRpcProvider(Network.development.url);
const stampProofs = new ethers.Contract(
    Network.development.stampProofs,
    require("./contracts/StampProofs.json").abi,
    provider
);

const addEventToCache = async (event : Events, data : any) => {
    switch (event) {
        case Events.stampProof:
            console.log(data.id + ": " + data.hash + " (timestamp: " + data.timestamp + ")");
            // try {
            //     db.query(
            //         "INSERT INTO stamps VALUES($1, $2, $3)",
            //         [data.id, data.hash, data.timestamp],
            //         (err, res) => {
            //             if (err) console.log(err);
            //         }
            //     );
            // } catch (e) {
            //     console.log("error: ", e);
            // }
            // break
    }
};

provider.resetEventsBlock(0);

enum Events {
    stampProof = "stampProof", 
    functionProof = "functionProof", 
    transferProof = "transferProof", 
    dataWipeProof = "dataWipeProof",
    reuseProof = "reuseProof", 
    recycleProof = "recycleProof", 
}

stampProofs.on("stampProof", async (id : any, hash : any, timestamp : any) => {
    addEventToCache(Events.stampProof, {
        id: Number(id),
        hash: hash.slice(2),
        timestamp: Number(timestamp)
    });
});

