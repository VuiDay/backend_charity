const Category = require("../models/Category");
const Charity = require("../models/Charity");
const User = require("../models/User")
const Donate = require("../models/Donate")

const statistical = {
    async generalStistical(req, res) {
        try {
            const userCount = await User.countDocuments({});
            const charityCount = await Charity.countDocuments({});
            const categoryCount = await Category.countDocuments({});
            res.json({ user: userCount, charity: charityCount, category: categoryCount })
        } catch (err) {
            return res.status(401).json({
                name: err.name,
                message: err.massage
            })
        }
    },
    async financeStistical(req, res) {
        try {
            const dataUser = [];
            const data = await Donate.find();
            if (!data) {
                return res.status(500).json(false);
            }
            for (let donate of data) {
                const user = await User.findOne({ _id: donate.User });
                const charity = await Charity.findOne({ _id: donate.Charity });
                dataUser.push({
                    UserName: user.UserName,
                    Amount: donate.Amount,
                    Status: donate.Status,
                    Charity: charity.Title,
                    Time: donate.createdAt
                });
            }
            res.json(dataUser);
        } catch (err) {
            return res.status(401).json({
                name: err.name,
                message: err.massage
            })
        }
    },
    async userStistical(req, res) {
        try {
            const user = await User.find({}, { Password: 0 });
            res.json(user)
        } catch (err) {
            return res.status(401).json({
                name: err.name,
                message: err.massage
            })
        }
    }
}

module.exports = statistical