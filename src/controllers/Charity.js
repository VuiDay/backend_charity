const Charity = require('../models/Charity.js')
const CategoryCharity = require('../models/Category.js')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary = require('../configs/cloundinaryConfig.js');
const User = require('../models/User.js');
const Donate = require('../models/Donate.js')

const charitys = {
    async getCharity(req, res) {
        try {
            let limit = req.query.page
            if (limit === 0) {
                const data = await Charity.find()
                if (!data) {
                    return res.status(500).json({ message: 'Không tìm thấy dữ liệu' })
                }
                res.json(data)
            }
            const dataLimit = await Charity.find().limit(limit)
            if (!dataLimit) {
                return res.status(500).json({ message: 'Không tìm thấy dữ liệu' })
            }
            res.json(dataLimit)
        } catch (err) {
            res.status(401).json({
                name: err.name,
                message: err.massage
            })
        }
    },
    async getCharityDonate(req, res) {
        try {
            const user = req.user
            const charityArray = []
            const charityId = []
            const donate = await Donate.find({ User: user.id }).sort({ createdAt: -1 });
            if (!donate) {
                return res.status(500).json({ message: 'Bạn chưa ủng hộ chiến dịch nào' })
            }
            for (let data of donate) {
                const charity = await Charity.findOne({ _id: data.Charity })
                if (charity) {
                    const charityWithAmount = {
                        ...charity.toObject(),
                        timeDonate: data.createdAt,
                        Amount: data.Amount
                    };
                    charityArray.push(charityWithAmount);
                }
                // if (!charityId.includes(charity.Title)) {
                //     charityArray.push(charity)
                //     charityId.push(charity.Title)
                // }
            }
            console.log(charityArray)
            res.json({ data: charityArray })
        } catch (err) {
            res.status(401).json({
                name: err.name,
                message: err.massage
            })
        }
    },
    async getCharityById(req, res) {
        try {
            const id = req.params.id
            if (id) {
                const data = await Charity.findOne({ _id: id })
                if (!data) {
                    return res.status(500).json({ message: 'Không tìm thấy dữ liệu!' })
                }
                const user = await User.findOne({ _id: data.User })
                data.User = user.UserName
                res.json(data)
                console.log(data)
            }
        } catch (err) {
            res.status(401).json({
                name: err.name,
                message: err.massage
            })
        }
    },
    async countCharity(req, res) {
        try {
            const CountOnline = await Charity.countDocuments({ Status: true })
            const CountOffline = await Charity.countDocuments({ Status: false })
            res.json({
                CharityOnline: CountOnline,
                CharityOffline: CountOffline
            })
        } catch (err) {
            res.status(401).json({
                name: err.name,
                message: err.massage
            })
        }
    },
    async getCharityByIdCategory(req, res) {
        try {
            const id = req.params.id
            const skip = req.query.skip
            if (id) {
                const data = await Charity.find({ Category: id }).limit(10).skip(skip)
                if (!data) {
                    res.status(500).json({ message: 'Không tìm thấy dữ liệu!' })
                }
                res.json(data)
            }
        } catch (err) {
            res.status(401).json({
                name: err.name,
                message: err.massage
            })
        }
    },
    async getCharityByUser(req, res) {
        try {
            const userId = req.user
            const data = await Charity.find({ User: userId.id })
            if (!data) {
                return res.status(500).json({ message: 'User không có chiến dịch nào!' })
            }
            res.json({ data: data })
        } catch (err) {
            res.status(401).json({
                name: err.name,
                message: err.massage
            })
        }
    },
    async changeStatus(req, res) {
        try {
            const { id, status } = req.body;

            // if (!status.length || !id.length) {
            //     return res.status(400).json({ message: 'Id và status là bắt buộc' });
            // }

            const charity = await Charity.findByIdAndUpdate(
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
    async updateCharity(req, res) {
        try {
            const { id } = req.query;
            const { Title, Address, Category, TargetMoney, EndTime, Description, Bank, idBank } = req.body;
            const Image = req.files;
            const userId = req.user;
            const imageURLs = [];

            if (!id) return res.status(400).json({ message: 'Id is required' });
            if (!Title || !Address || !Category || !TargetMoney || !EndTime || !Description) {
                return res.status(400).json({ message: 'Yêu cầu nhập dữ liệu vào form!!' });
            }

            const category = await CategoryCharity.findOne({ _id: Category });
            const user = await User.findOne({ _id: userId.id });

            if (!user) {
                return res.status(404).json({ message: 'Không tìm thấy người dùng này!' });
            }

            if (!category) {
                return res.status(404).json({ message: 'Mục này không tồn tại!!' });
            }

            let charity = await Charity.findOne({ _id: id });

            if (!charity) {
                return res.status(404).json({ message: 'Chiến dịch không tồn tại!' });
            }

            const timeNow = new Date();
            const endTime = new Date(EndTime);
            const timeDifferent = endTime.getTime() - timeNow.getTime();
            const oneMonth = 30 * 24 * 60 * 60 * 1000;
            let campaignType = timeDifferent <= oneMonth ? 0 : 1;

            if (Image && Image.length > 0) {
                for (const file of Image) {
                    const result = await cloudinary.uploader.upload(file.path);
                    const imageURL = result.secure_url;
                    imageURLs.push(imageURL);
                }
            }
            charity.Title = Title;
            charity.Address = Address;
            charity.Category = Category;
            charity.TargetMoney = TargetMoney;
            charity.EndTime = EndTime;
            charity.Description = Description;
            charity.Type = campaignType;
            charity.InforBank = {
                name: Bank,
                account: idBank
            };

            if (imageURLs.length > 0) {
                charity.Image = imageURLs;
            }

            await charity.save();

            res.json({
                message: 'Cập nhật chiến dịch thành công!',
                status: true,
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({
                name: err.name,
                message: err.message
            });
        }
    },
    async createCharity(req, res) {
        try {
            const { Title, Address, Category, TargetMoney, EndTime, Description, Bank, idBank } = req.body
            const Image = req.files;
            const userId = req.user;
            const imageURLs = []
            if (!Title || !Address || !Category || !TargetMoney || !EndTime || !Image || !Description) return res.status(500).json('Yêu cầu nhập dữ liệu vao form!!')
            const Categorys = await CategoryCharity.findOne({
                _id: Category
            })
            const user = await User.findOne({ _id: userId.id })
            if (!user) {
                return res.status(500).json({ message: 'Ko tìm thấy người dùng này!' })
            }
            if (!Categorys) return res.status(500).json({ message: 'Mục này ko tồn tại!!' })
            let data = await Charity.findOne({
                $or: [
                    { Title: Title },
                    { Address: Address }
                ]
            })
            if (data) return res.status(500).json({ message: 'Bài đăng này đã tồn tại!' })

            const timeNow = new Date();
            const endTime = new Date(EndTime)
            const timeDifferent = endTime.getTime() - timeNow.getTime();
            let campaignType = null;
            const oneMonth = 30 * 24 * 60 * 60 * 1000;
            console.log(timeDifferent, oneMonth)
            if (timeDifferent <= oneMonth) {
                campaignType = 0;
            } else {
                campaignType = 1;
            }

            for (const file of Image) {
                const result = await cloudinary.uploader.upload(file.path);
                const imageURL = result.secure_url;
                imageURLs.push(imageURL)
            }
            Charity.create({
                Title: Title,
                Status: 2,
                User: userId.id,
                Address: Address,
                Category: Category,
                TargetMoney: TargetMoney,
                Image: imageURLs,
                Type: campaignType,
                InforBank: {
                    name: Bank,
                    account: idBank
                },
                Description: Description,
                EndTime: EndTime
            })
            res.json({
                message: 'Thêm bài viết thành công!!', status: true
            })
        } catch (err) {
            return res.status(401).json({
                name: err.name,
                message: err.massage
            })
        }

    }
}

module.exports = charitys;
