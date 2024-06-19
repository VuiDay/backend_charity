const Payment = require('../models/Payment')

const payments = {
    async PaymentList(req, res) {
        try {
            const data = await Payment.find()
            if (!data) {
                return res.status(500).json({ message: 'Error ko tìm thấy phương thức nào!!' })
            }
            res.json(data)
        } catch (err) {
            res.status(401).json({
                name: err.name,
                message: err.message
            })
        }
    },
    async PaymentCreate(req, res) {
        try {
            const { method, description } = req.body
            if (!method || !description) {
                res.status(500).json({ message: 'Yêu cầu nhập đầy đủ thông tin!!' })
            }
            const data = await Payment.findOne({ Method: method })
            if (data) {
                res.status(500).json({ message: 'Đã tồn tại phương thức thanh toán này!' })
            }
            await Payment.create({
                Method: method,
                Description: description
            })
            res.json({ message: 'Thêm phương thức thanh toán thành công!!' })
        } catch (err) {
            res.status(401).json({
                name: err.name,
                message: err.message
            })
        }
    }
}

module.exports = payments