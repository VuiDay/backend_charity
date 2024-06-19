const cron = require('node-cron');
const Charity = require('../models/Charity');
const User = require('../models/User');
const Donate = require('../models/Donate');

const checkStatusCharity = async () => {
    try {
        const charities = await Charity.find();
        const currentDate = new Date();

        for (const charity of charities) {
            const endDate = new Date(charity.EndTime);
            if (endDate < currentDate) {
                charity.Status = 1
                await charity.save();
            }
        }
    } catch (error) {
        console.error('Lỗi hệ thống!!!', error);
    }
}

const checkUser = async () => {
    try {
        const users = await User.find();
        for (const user of users) {
            if (!user.UserName || !user.Password) {
                await User.findByIdAndDelete({ _id: user._id })
            }
        }
    } catch (error) {
        console.error('Lỗi hệ thống!!!', error);
    }
}

const checkDonate = async () => {
    try {
        const donate = await Donate.find();
        for (const data of donate) {
            if (data.Status === 2) {
                await Donate.findByIdAndDelete({ _id: data._id })
            }
        }
    } catch (error) {
        console.error('Lỗi hệ thống!!!', error);
    }
}

const cronJob = () => {
    cron.schedule('0 0 * * * *', () => {
        const date = new Date()
        console.log('Update', date.getDate())
        checkStatusCharity()
        checkUser()
        checkDonate()
    });
}


module.exports = cronJob