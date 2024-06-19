const mongoose = require('mongoose');
require('dotenv').config()

const connect = async () => {
    try {
        await mongoose.connect(process.env.DB)
    } catch (err) {
        console.error('Error connect: ', err)
    }
}

module.exports = connect

