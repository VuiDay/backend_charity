const Donate = require('../models/Donate');
const Charity = require('../models/Charity');
const User = require('../models/User');
var jwt = require('jsonwebtoken');
const secret = process.env.BC_SECRET;
const { sendMail } = require('../modules/Mail');
const payos = require('../modules/payos')
const domain = process.env.YOUR_DOMAIN
const Helper = require('../util/helper')

const donates = {
  //Hàm tạo thanh toán tạm thời
  // async DonateCreate(req, res) {
  //   try {
  //     const { fullname, charity, amount, message, payment } = req.body;
  //     const user = req.user;
  //     if (!user || !fullname || !charity || !amount || !message || !payment) {
  //       return res.status(500).json({ message: 'Nhập chưa đủ thông tin!!', status: false });
  //     };
  //     const userCheck = await User.findOne({ _id: user.id })
  //     if (!userCheck) {
  //       return res.status(500).json({ message: 'Người dùng ko tồn tại!', status: false })
  //     }
  //     const dataCharity = await Charity.findOne({ _id: charity })
  //     if (!dataCharity) {
  //       res.status(500).json({ message: 'Chiến dịch này ko tồn tại!', status: false });
  //     }
  //     if (amount < 0) {
  //       res.status(500).json({ message: 'Yêu cầu ko nhập số tiền âm!!', status: false })
  //     }
  //     await Donate.create({
  //       User: user.id,
  //       Fullname: fullname,
  //       Charity: charity,
  //       Amount: amount,
  //       Message: message,
  //       Payment: payment,
  //       Status: true
  //     })
  //     await Charity.findOneAndUpdate({ _id: charity }, { $inc: { Money: amount } }, { new: true });
  //     await User.findOneAndUpdate({ _id: user.id }, { $inc: { Rating: 1 } }, { new: true });
  //     const content = ` <div
  //           style="display: flex; justify-content: center; background-color: #333366; flex-direction: column"
  //         >
  //           <div style="display: flex; flex-direction: column; align-items: center">
  //             <img
  //               width="500px"
  //               src="https://seduacademy.edu.vn/public/upload/bai-viet/toan-bo-kien-thuc-ve-thi-tuong-lai-don-kem-bai-tap/new/image2.png?1694675286119"
  //               alt=""
  //             />
  //             <div
  //               style="
  //                 display: flex;
  //                 flex-direction: column;
  //                 align-items: start;
  //                 width: 80%;
  //                 margin-top: 10px;
  //               "
  //             >
  //               <h4 style="font-size: 20px; color: white">Hi, ${userCheck.UserName}</h4>
  //               <h4 style="font-size: 15px; color: white">
  //                 Cảm ơn ${userCheck.UserName} đã ủng hộ chiến dịch, số tiền bạn ủng hộ sẽ được đưa đến
  //                 tay người được ủng hộ của chiến dịch
  //               </h4>
  //               <div style="margin-top: 20px; color: white">
  //                 <p>Số tiền: ${amount}đ</p>
  //                 <p>Tên chiến dịch: ${dataCharity.Title}</p>
  //               </div>
  //               <div style="margin-top: 40px">
  //                 <h6 style="color: white">Thông tin liên hệ của chúng tôi</h6>
  //                 <p style="color: white">Email: ungdungtuthien@gmail.com</p>
  //                 <p style="color: white">
  //                   Facebook: https://www.facebook.com/profile.php?id=100040116545591
  //                 </p>
  //               </div>
  //             </div>
  //           </div>
  //         </div>`
  //     await sendMail(userCheck.Email, content);
  //     res.json({ message: 'Đã ủng hộ thành công!', status: true });
  //   } catch (err) {
  //     res.status(401).json({
  //       name: err.name,
  //       message: err.massage
  //     });
  //   }
  // },
  async createPayment(req, res) {
    try {
      const { amount, code } = req.body;
      const user = req.user;
      const username = await User.findOne({ _id: user.id });
      if (!username) {
        res.status(500).json({ message: 'Không thể tìm thấy người dùng này!' });
      }
      const nameCharity = await Charity.findOne({ _id: code });
      if (!nameCharity) {
        return res.status(500).json({ message: 'Không thể tìm thấy chiến dịch này!' });
      }
      const desc = Helper.random(9);
      const codeOrder = Helper.generateOrderCode();
      const order = {
        orderCode: codeOrder,
        amount: Number(amount),
        description: `${desc}`,
        buyerName: username.UserName,
        buyerEmail: username.Email,
        returnUrl: `${domain}/infor/${code}`,
        cancelUrl: `${domain}/infor/${code}`
      };
      // 2: Đang chờ
      // 1: Đã huỷ
      // 0: Thành công
      await Donate.create({
        User: user.id,
        Charity: code,
        Amount: amount,
        Status: 2,
        Code: desc
      })
      const paymentLink = await payos.createPaymentLink(order);
      res.json({ url: paymentLink.checkoutUrl });
    } catch (err) {
      res.status(401).json({
        name: err.name,
        message: err.massage
      });
    }
  },
  async AuthenDonate(req, res) {
    try {
      if (req.body.code === '00') {
        const code = req.body.data.description.split(' ')[1];
        const amount = req.body.data.amount;
        const inforDonate = await Donate.findOneAndUpdate({ Code: code }, { Status: 0 }, { new: true });
        const charity = await Charity.findOne({ _id: inforDonate.Charity })
        await Charity.findOneAndUpdate({ _id: inforDonate.Charity }, { $inc: { Money: amount } }, { new: true });
        if (Number(amount) < 100000) {
          await User.findOneAndUpdate({ _id: inforDonate.User }, { $inc: { Rating: 0.5 } }, { new: true });
        } else {
          await User.findOneAndUpdate({ _id: inforDonate.User }, { $inc: { Rating: 1 } }, { new: true });
        }
        if (Number(charity.TargetMoney) - Number(charity.Money) <= 0) {
          charity.Status = false;
          await charity.save();
        }
      }
      return res.status(200).send({
        success: true,
        code: 200
      });
    } catch (err) {
      return res.status(401).json({
        name: err.name,
        message: err.massage
      });
    }
  },
  async getDonate(req, res) {
    try {
      const { id } = req.params;
      const dataUser = [];
      const data = await Donate.find({
        Charity: id, Status: 0
      })
      if (!data) {
        res.status(500).json(false);
      }
      for (let donate of data) {
        const user = await User.findOne({ _id: donate.User });
        dataUser.push({
          UserName: user.UserName,
          Amount: donate.Amount,
          Time: donate.createdAt
        });
      }
      res.json(dataUser);
    } catch (err) {
      res.status(401).json({
        name: err.name,
        message: err.message
      });
    }
  }
}

module.exports = donates