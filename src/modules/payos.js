const Payos = require("@payos/node");
require('dotenv').config()
const client_id = process.env.CLIENT_ID
const api_key = process.env.API_KEY
const checksum_key = process.env.CHECKSUM_KEY

const payos = new Payos(client_id, api_key, checksum_key)

module.exports = payos