const mongoose = require('mongoose');
const { Schema } = mongoose

const Question = new Schema({
    Question: { type: String, require: true, unique: true },
    Answer: { type: String, require: true, unique: true },
    Category: { type: String }
}, {
    timestamps: true
})

module.exports = mongoose.model('Question', Question, 'Question')