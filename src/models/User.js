const mongoose = require('mongoose');
const { Schema } = mongoose

const UserInfor = new Schema({
    UserName: { type: String },
    Password: { type: String },
    Email: { type: String, unique: true },
    Avatar: {
        Image: { type: String, default: 'https://res.cloudinary.com/dn6xdmqbl/image/upload/v1712303681/avatar_user/frmn8coyzmfigcfivno2.png' },
        Public_id: { type: String, default: 'avatar_user/frmn8coyzmfigcfivno2' }
    },
    Rating: { type: Number, default: 0 },
    Role: { type: String, default: 'Member' },
    Status: { type: Number },
    Code: { type: String }
}, {
    timestamps: true
})

module.exports = mongoose.model('User', UserInfor, 'User')