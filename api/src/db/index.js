const { Client } = require("pg")

const client = new Client({ query_timeout: 10000 })

const connect = async () => {
  try {
    await client.connect()
  } catch (e) {
    console.log(e)
  }
}
connect()
module.exports = client
