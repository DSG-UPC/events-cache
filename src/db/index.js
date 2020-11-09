const { Client } = require("pg");
require('dotenv').config();

const client = new Client()

const connect = async () => {
    try {
        await client.connect()
    } catch (e) {
        console.log(e)
    }
}
connect()
module.exports = client