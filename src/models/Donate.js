const mongoose = require('mongoose');
const { Schema } = mongoose

const DonateUser = new Schema({
    User: { type: String, require: true },
    Charity: { type: String, require: true },
    Amount: { type: Number, require: true },
    Status: { type: Number, require: true },
    Payment: { type: String },
    Code: { type: String, default: null }
}, {
    timestamps: true
})

module.exports = mongoose.model('Donate', DonateUser, 'Donate')