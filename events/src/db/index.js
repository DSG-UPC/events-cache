const { Client } = require("pg")

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
