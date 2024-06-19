const mongoose = require('mongoose');
const { Schema } = mongoose

const Evalute = new Schema({
    Charity: { type: String },
    User: { type: String, require: true },
    Rating: { type: String, require: true }
}, {
    timestamps: true
})

module.exports = mongoose.model('Evalute', Evalute, 'Evalute')