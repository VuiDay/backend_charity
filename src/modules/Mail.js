const nodemailer = require('nodemailer')

const CodeRandom = () => {
    const numberLength = 10
    const results = []
    for (let i = 0; i < 6; i++) {
        results.push((Math.floor(Math.random() * numberLength)))
    }
    return results.join('')
}

const sendMail = (email, content) => {
    return new Promise((resolve, reject) => {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.NODEMAIL_EMAIL,
                pass: process.env.NODEMAIL_PASSWORD
            },
        });
        const mainOptions = {
            from: {
                name: 'Web Từ Thiện',
                address: process.env.NODEMAIL_EMAIL
            },
            to: email,
            subject: 'Nhận mã xác thực',
            html: content
        };
        transporter.sendMail(mainOptions, (err, info) => {
            if (err) {
                reject(err);
            } else {
                resolve(info);
            }
        });
    });
}


module.exports = { CodeRandom, sendMail }