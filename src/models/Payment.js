const mongoose = require('mongoose');
const { Schema } = mongoose

const Payment = new Schema({
    Method: { type: String, unique: true },
    Enable: { type: Boolean, default: true },
    Description: { type: String }
}, {
    timestamps: true
})

module.exports = mongoose.model('Payment', Payment, 'Payment')