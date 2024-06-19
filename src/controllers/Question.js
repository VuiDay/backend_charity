const Question = require('../models/Question')

const questions = {
    async createQuestion(req, res) {
        try {
            const { question, answer } = req.body
            const qs = await Question.findOne({ Question: question, Answer: answer })
            if (qs) return res.status(500).json({ message: 'Đã tồn tại câu hỏi này' })
            await Question.create({
                Question: question,
                Answer: answer
            })
            res.json({ message: 'Thêm câu hỏi thành công!' })
        } catch (err) {
            res.status(401).json({
                name: err.name,
                message: err.massage
            })
        }
    },
    async getQuestion(req, res) {
        try {
            const data = await Question.find()
            if (!data) {
                return res.status(500).json({ message: 'Không có dữ liệu!' })
            }
            res.json(data)
        } catch (err) {
            res.status(401).json({
                name: err.name,
                message: err.massage
            })
        }
    }
}

module.exports = questions