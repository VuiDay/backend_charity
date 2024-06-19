const Category = require('../models/Category')
const cloudinary = require('../configs/cloundinaryConfig.js');
const Charity = require('../models/Charity.js');

const categorys = {
    async getCategory(req, res) {
        try {
            const data = await Category.find()
            const counts = []
            if (!data) {
                return res.status(500).json({ message: 'Không có dữ liệu!' })
            }
            for (let cate of data) {
                const count = await Charity.countDocuments({ Category: cate._id })
                const countOnline = await Charity.countDocuments({ Category: cate._id, Status: 0 })
                const countOffline = await Charity.countDocuments({ Category: cate._id, Status: 1 })
                counts.push({
                    id: cate._id,
                    name: cate.Title,
                    count: count,
                    countOn: countOnline,
                    countOff: countOffline
                });
            }
            console.log(counts)
            res.json({ data: data, count: counts })
        } catch (err) {
            res.status(401).json({
                name: err.name,
                message: err.message
            })
        }
    },
    async getCategoryID(req, res) {
        try {
            const id = req.params.id
            if (!id) {
                return res.status(500).json({ message: 'Error id' })
            }
            const data = await Category.findOne({ _id: id })
            if (!data) {
                return res.status(500).json({ message: 'Không tìm thấy dữ liệu!' })
            }
            res.json(data)
        } catch (err) {
            res.status(401).json({
                name: err.name,
                message: err.message
            })
        }
    },
    async createCategory(req, res) {
        try {
            const { Title, Description } = req.body
            const Image = req.file.path
            if (!Title) return res.status(500).json('Yêu cầu nhập thông tin vào form!!')
            const category = await Category.findOne({ Title: Title })
            if (category) return res.status(500).json('Danh mục này đã tồn tại!!')
            const results = await cloudinary.uploader.upload(Image);
            let imageURL = results.secure_url;
            await Category.create({
                Title: Title,
                Description: Description,
                Image: imageURL.length > 0 ? imageURL : null
            })
            res.json('Thêm danh mục thành công!')
        } catch (error) {
            res.status(401).json({
                name: error.name,
                message: error.message
            })
        }
    }
}

module.exports = categorys