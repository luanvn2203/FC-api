const nodeMailer = require('nodemailer');

const adminMail = 'luanvnse63360@gmail.com';
const adminMailPassword = 'Nhutluan1230';

const mailHost = 'smtp.gmail.com';
const mailPort = 587;
const sendMail = (to, subject, htmlContent) => {
    const transporter = nodeMailer.createTransport({
        host: mailHost,
        port: mailPort,
        secure: false,
        auth: {
            user: adminMail,
            pass: adminMailPassword
        }
    })

    const options = {
        from: adminMail, // địa chỉ admin email bạn dùng để gửi
        to: to, // địa chỉ gửi đến
        subject: subject, // Tiêu đề của mail
        html: htmlContent // Phần nội dung mail mình sẽ dùng html thay vì thuần văn bản thông thường.
    }
    return transporter.sendMail(options)
}

module.exports = {
    sendMail: sendMail
}