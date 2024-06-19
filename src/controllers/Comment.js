const Comment = require('../models/Comment')
const cloudinary = require('../configs/cloundinaryConfig.js');
const User = require('../models/User.js');

const comments = {
    async createComment(req, res) {
        try {
            const { post, message } = req.body;
            const userID = req.user;
            const image = req.files;
            const imageURLs = [];
            if (!message || !image) {
                return res.status(500).json({ message: 'Bạn chưa nhập comment!', status: false })
            } else if (!post) {
                return res.status(500).json({ message: 'Bài đăng đã bị xoá!', status: false })
            }
            if (image && image.length > 0) {
                for (const file of image) {
                    const result = await cloudinary.uploader.upload(file.path);
                    const imageURL = result.secure_url;
                    imageURLs.push(imageURL);
                }
            }
            await Comment.create({
                Post: post,
                User: userID.id,
                Image: image ? imageURLs : null,
                Message: message
            });
            res.json({ message: 'Đăng bài thành công', status: true });
        } catch (err) {
            res.status(401).json({
                name: err.name,
                message: err.massage
            });
        };
    },
    async getComment(req, res) {
        try {
            const post = req.params.id;
            const page = req.query.page;
            const limit = page * 5;
            const inforCm = [];
            const addComment = {};
            if (!post) {
                return res.json({ message: 'Ko tồn tại bài đăng!!', status: false })
            }
            const commentSort = await Comment.find({ Post: post })
            const countCm = await Comment.countDocuments({ Post: post })
            const newCommentSort = commentSort.sort((a, b) => {
                const timeA = new Date(a.createdAt)
                const timeB = new Date(b.createdAt)
                return timeB - timeA
            })
            const comment = newCommentSort.slice(0, limit)
            for (let data of comment) {
                let user = await User.findOne({ _id: data.User })
                inforCm.push({
                    id: data._id,
                    idPost: post,
                    UserName: user.UserName,
                    idUser: user._id,
                    Avatar: user.Avatar,
                    Image: data.Image,
                    Message: data.Message,
                    Like: data.Like,
                    Time: data.createdAt
                })
            }
            if (Math.ceil(countCm / 5) === parseInt(page)) {
                addComment[post] = false
            } else {
                addComment[post] = true
            }
            res.json({ inforCm, addComment })
        } catch (err) {
            res.status(401).json({
                name: err.name,
                message: err.massage
            });
        };
    }
}

module.exports = comments