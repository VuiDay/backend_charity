const mongoose = require('mongoose');
const { Schema } = mongoose

const CharitySituation = new Schema({
    Status: { type: Number, default: true },
    User: { type: String },
    Title: { type: String, require: true, unique: true },
    Address: { type: String, require: true },
    Image: { type: [String], require: true, unique: true },
    Category: { type: String },
    TargetMoney: { type: Number, require: true },
    Type: { type: Number },
    InforBank: {
        name: { type: String },
        account: { type: String }
    },
    Money: { type: Number, default: 0 },
    EndTime: { type: Date, require: true },
    Description: { type: String, default: null }
}, {
    timestamps: true
})

module.exports = mongoose.model('Charity', CharitySituation, 'Charity') 