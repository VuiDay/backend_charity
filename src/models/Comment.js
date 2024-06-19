const mongoose = require('mongoose');
const { Schema } = mongoose

const Comment = new Schema({
    Post: { type: String },
    User: { type: String, require: true },
    Image: { type: [String] },
    Like: { type: Number, default: 0 },
    Message: { type: String, require: true, default: null }
}, {
    timestamps: true
})

module.exports = mongoose.model('Comment', Comment, 'Comment')