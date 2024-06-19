const User = require('../models/User.js');
const Donate = require('../models/Donate.js');
const cloudinary = require('../configs/cloundinaryConfig.js')
var passport = require('passport');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const secret = process.env.BC_SECRET;
var LocalStrategy = require('passport-local');
const { CodeRandom, sendMail } = require('../modules/Mail.js');
const { uploadAvatar } = require('../modules/Upload')
require('dotenv').config()

const users = {
    async getUser(req, res) {
        try {
            let userID = req.user
            if (!userID) {
                return req.status(500).json({ message: 'Ko nhận được ID!' })
            }
            const data = await User.findOne({ _id: userID.id }, { Password: 0 });
            if (!data) {
                return res.status(500).json({ message: 'Ko tìm thấy dữ liệu người dùng này!' })
            }
            return res.json(data)
        } catch (err) {
            return res.status(400).json({
                name: err.name,
                message: err.message
            });
        }
    },
    async changeStatus(req, res) {
        try {
            const { id, status } = req.body;

            // if (!status.length || !id.length) {
            //     return res.status(400).json({ message: 'Id và status là bắt buộc' });
            // }

            const charity = await User.findByIdAndUpdate(
                id,
                { Status: status, createdAt: new Date() },
                { new: true, runValidators: true }
            );

            if (!charity) {
                return res.status(404).json({ message: 'Chiến dịch không tồn tại' });
            }

            res.json({
                message: 'Cập nhật trạng thái thành công!',
                status: true,
            });
        } catch (err) {
            res.status(500).json({
                name: err.name,
                message: err.message
            });
        }
    },
    async getListUser(req, res) {
        try {
            const amountUser = {};
            const datas = await Donate.find({ Status: 0 });
            for (let data of datas) {
                const userID = data.User.toString();
                const user = await User.findOne({ _id: data.User })
                if (amountUser[userID]) {
                    amountUser[userID].Amount += data.Amount
                } else {
                    amountUser[userID] = {
                        UserName: user.UserName,
                        Avatar: user.Avatar,
                        Amount: data.Amount
                    }
                }
            }
            const userList = Object.values(amountUser)
            res.json(userList)
        } catch (err) {
            return res.status(400).json({
                name: err.name,
                message: err.message
            });
        }
    },
    async getUserByID(req, res) {
        try {
            let userID = req.query.id
            if (!userID) {
                return req.status(500).json({ message: 'Ko nhận được ID!' })
            }
            const data = await User.findOne({ _id: userID }, { Password: 0 });
            if (!data) {
                return res.status(500).json({ message: 'Ko tìm thấy dữ liệu người dùng này!' })
            }
            res.json(data)
        } catch (err) {
            return res.status(400).json({
                name: err.name,
                message: err.message
            });
        }
    },
    async verifYEmail(req, res) {
        try {
            const { email } = req.body
            const user = await User.findOne({ Email: email })
            if (user) {
                return res.status(500).json({ message: 'Email này đã tồn tại!' })
            } else {
                const code = CodeRandom();
                let content = `
                <div style="padding: 10px; background-color: #003375">
                    <div style="padding: 10px; background-color: white;">
                        <h4 style="color: #0085ff">Mã xác thực email</h4>
                        <span style="color: black">Code: ${code}</span>
                    </div>
                </div>
                `;
                await sendMail(email, content);
                await User.create({
                    Email: email,
                    Code: code
                })
                jwt.sign({ email: email }, secret, { algorithm: 'HS256', expiresIn: '1d' }, (err, data) => {
                    if (err) {
                        return res.status(500).json({ error: err })
                    }
                    return res.json({ token: data, status: true })
                })
            }
        } catch (err) {
            return res.status(400).json({
                name: err.name,
                message: err.message,
                status: false
            });
        }
    },
    async verifyCode(req, res) {
        try {
            const { email, code } = req.user
            const user = await User.findOne({ Email: email.email })
            if (!user) {
                return res.status(500).json({ message: 'Ko  tìm thấy dữ liệu!!', status: false });
            } else if (user.Code !== code) {
                return res.status(500).json({ message: 'Nhập sai mã xác nhận!!', status: false })
            }
            res.json({ message: 'Mã xác nhận trùng khớp 0.0', status: true })
        } catch (err) {
            res.status(401).json({
                name: err.name,
                message: err.message
            })
        }
    },
    async RegisterApp(req, res) {
        try {
            const { username, password } = req.body;
            const avatar = req.file ? req.file.path : null;
            const email = req.user;
            if (email || username || password) {
                let data = await User.findOne({ UserName: username });
                if (data) {
                    return res.status(500).json('Đã tồn tại tên đăng nhập này!');
                }
                if (avatar !== null) {
                    const results = await cloudinary.uploader.upload(avatar);
                    let avatarURL = results.secure_url;
                    let idImage = results.public_id;
                    const hash = await bcrypt.hash(password, 10)
                    await User.findOneAndUpdate({ Email: email.email }, { UserName: username, Password: hash, Avatar: { Image: avatarURL, Public_id: idImage } }, { new: true })
                } else {
                    const hash = await bcrypt.hash(password, 10)
                    await User.findOneAndUpdate({ Email: email.email }, { UserName: username, Password: hash }, { new: true })
                }

                await User.updateOne({ Email: email.email }, { $unset: { Code: 1 } })
                res.json({ message: 'Đăng kí thành công!', status: true });
            } else {
                return res.status(500).json('Yêu cầu nhập đầy đủ thông tin vào Form!')
            }
        } catch (error) {
            return res.status(401).json({
                name: error.name,
                message: error.message
            });
        };
    },
    async LoginApp(req, res) {
        try {
            const { email, password } = req.body
            if (!email || !password) {
                return res.status(500).json({ message: 'Yêu cầu nhập đủ thông tin vào form!!', staus: false })
            }
            const user = await User.findOne({ Email: email })
            if (!user) {
                return res.status(500).json({ message: 'Tài khoản ko tồn tại!', staus: false })
            }
            bcrypt.compare(password, user.Password, (err, match) => {
                if (!match) {
                    res.status(500).json({ message: 'Nhập sai mật khẩu!', staus: false })
                }
                jwt.sign({ id: user._id }, secret, { algorithm: 'HS256', expiresIn: '1d' }, (err, data) => {
                    if (err) {
                        return res.status(500).json('error: ', err)
                    }
                    res.json({
                        token: data, data: {
                            Username: user.UserName,
                            Email: user.Email,
                            Avatar: user.Avatar,
                            Role: user.Role,
                            Status: user.Status
                        }, status: true
                    })
                })
            })
        } catch (error) {
            return res.status(400).json({
                name: error.name,
                message: error.message
            });
        };
    },
    async changeAvatar(req, res) {
        try {
            const avatar = req.file.path;
            const userID = req.user;
            if (!userID) {
                return res.status(500).json({ message: 'Lỗi hệ thống không nhận được Id' })
            }
            const user = await User.findOne({ _id: userID.id })
            if (!user) {
                return res.status(500).json({ message: 'Tài khoản ko tồn tại' })
            }
            const results = await cloudinary.uploader.upload(avatar, { resource_type: 'image' });
            let avatarURL = results.secure_url;
            let idImage = results.public_id;
            if (user.Avatar && user.Avatar.Public_id) {
                await cloudinary.uploader.destroy(user.Avatar.Public_id);
            }
            await User.findOneAndUpdate({ _id: userID.id }, { Avatar: { Image: avatarURL, Public_id: idImage } }, { new: true })
            res.json({ message: 'Đã sửa ảnh thành công', status: true })
        } catch (error) {
            return res.status(401).json({
                name: error.name,
                message: error.message
            });
        };
    },
    async changePw(req, res) {
        try {
            const { password, newpw } = req.body;
            const userID = req.user;
            if (!userID) {
                return res.status(500).json({ message: 'Lỗi hệ thống không nhận được Id' })
            }
            const user = await User.findOne({ _id: userID.id })
            if (!user) {
                return res.status(500).json({ message: 'Tài khoản ko tồn tại' })
            }
            if (!password || !newpw) {
                return res.status(500).json({ message: 'yêu cầu nhập đủ thông tin!' })
            }
            bcrypt.compare(password, user.Password, async (err, match) => {
                if (!match) {
                    return res.status(500).json({ status: false, message: 'sai mật khẩu!' })
                } else {
                    const hash = await bcrypt.hash(newpw, 10)
                    await User.findOneAndUpdate({ _id: userID.id }, { Password: hash }, { new: true })
                    return res.json({ status: true, message: 'Đổi mật khẩu thành công!' })
                }
            })
        } catch (error) {
            return res.status(400).json({
                name: error.name,
                message: error.message
            });
        };
    },
    async changeInforUser(req, res) {
        try {
            const { username } = req.body;
            const userID = req.user;
            if (!userID) {
                return res.status(500).json({ message: 'Lỗi hệ thống không nhận được Id' })
            }
            const user = await User.findOne({ _id: userID.id })
            if (!user) {
                return res.status(500).json({ message: 'Tài khoản ko tồn tại' })
            }
            const UserName = await User.findOne({ UserName: username })
            console.log(UserName)
            if (UserName) {
                return res.status(500).json({ status: false, message: 'Đã tồn tại tên này!' })
            }
            await User.findOneAndUpdate({ _id: userID.id }, { UserName: username }, { new: true })
            res.json({ status: true, message: 'Thay đổi thành công' })
        } catch (error) {
            return res.status(400).json({
                name: error.name,
                message: error.message
            });
        };
    }
}

module.exports = users;