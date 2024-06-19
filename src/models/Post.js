const mongoose = require('mongoose');
const { Schema } = mongoose

const PostUser = new Schema({
    Charity: { type: String },
    User: { type: String, require: true },
    Image: { type: [String] },
    Like: { type: Number, default: 0 },
    Messgae: { type: String }
}, {
    timestamps: true
})

module.exports = mongoose.model('Post', PostUser, 'Post')