const Post = require('../models/Post')
const cloudinary = require('../configs/cloundinaryConfig.js');
const User = require('../models/User.js');
const Comment = require('../models/Comment.js');

const posts = {
    async getPost(req, res) {
        try {
            const inforPost = []
            let page = req.query.page || 1
            const limit = req.query.limit || 5
            const skip = (page - 1) * limit
            const id = req.params.id
            const postSort = await Post.find({ Charity: id })
            const newPostSort = postSort.sort((a, b) => {
                const timeA = new Date(a.createdAt)
                const timeB = new Date(b.createdAt)
                return timeB - timeA
            })
            // const data = newPostSort.limit(limit).skip(skip)
            const data = newPostSort.slice(skip, skip + limit);
            const countData = await Post.countDocuments({ Charity: id })
            if (!data) {
                return res.status(500).json({ message: 'Không tìm thấy dữ liệu!' })
            }
            for (let post of data) {
                if (!post) {
                    return res.status(500).json({ message: 'Ko tồn tại bài đăng!!', status: false })
                }
                let user = await User.findOne({ _id: post.User })
                let comment = await Comment.countDocuments({ Post: post._id })
                inforPost.push({
                    id: post._id,
                    UserName: user.UserName,
                    idUser: user._id,
                    Avatar: user.Avatar,
                    Image: post.Image,
                    Message: post.Messgae,
                    Like: post.Like,
                    Time: post.createdAt,
                    countComment: comment,
                    Comment: comment !== 0 ? true : false
                });
            }
            if (!inforPost) {
                return res.status(500).json({ message: 'Không tìm thấy dữ liệu!' })
            }
            res.json({
                inforPost,
                totalPage: Math.ceil(countData / limit),
            })
        } catch (err) {
            res.status(401).json({
                name: err.name,
                message: err.massage
            })
        }
    },
    async creaetPost(req, res) {
        try {
            const { Charity, Message } = req.body
            const userID = req.user
            const Image = req.files
            const imageURLs = []
            if (!Message || !Image) {
                return res.status(500).json({ message: 'Điền đủ thông tin vào form', status: false })
            }
            if (!Charity) {
                res.status(500).json({ message: 'Chiến dịch ko còn tồn tại!', status: false })
            }
            for (const file of Image) {
                const result = await cloudinary.uploader.upload(file.path);
                const imageURL = result.secure_url;
                imageURLs.push(imageURL);
            }
            await Post.create({
                Charity: Charity,
                User: userID.id,
                Messgae: Message,
                Image: imageURLs.length > 0 ? imageURLs : null
            })
            res.json({ message: 'Đăng bài thành công!', status: true })
        } catch (err) {
            res.status(401).json({
                name: err.name,
                message: err.massage
            })
        }
    }
}

module.exports = posts