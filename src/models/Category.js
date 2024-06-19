const mongoose = require('mongoose');
const { Schema } = mongoose

const CategoryCharity = new Schema({
    Title: { type: String, require: true, unique: true },
    Image: { type: String },
    Description: { type: String, default: '' },
}, {
    timestamps: true
})

module.exports = mongoose.model('Category', CategoryCharity, 'Category')