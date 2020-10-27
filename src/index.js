const ethers = require("ethers");
const network = require("./contracts/network.json");
const { addEventToCache } = require("./event-router");

const provider = new ethers.providers.JsonRpcProvider(network.development.url);
const stampProofs = new ethers.Contract(
    network.development.stampProofs,
    require("./contracts/StampProofs.json").abi,
    provider
);

provider.resetEventsBlock(0);

var Events;
(function (Events) {
  Events["stampProof"] = "stampProof";
  Events["functionProof"] = "functionProof";
  Events["transferProof"] = "transferProof";
  Events["dataWipeProof"] = "dataWipeProof";
  Events["reuseProof"] = "reuseProof";
  Events["recycleProof"] = "recycleProof";
})(Events || (Events = {}));

addEventToCache(Events.functionProof, {
    deviceAddress: "123456789",
    diskUsage: 123
})

stampProofs.on(Events.stampProof, async (id, hash, timestamp) => {
    addEventToCache(Events.stampProof, {
        id: Number(id),
        hash: hash.slice(2),
        timestamp: Number(timestamp)
    });
});


