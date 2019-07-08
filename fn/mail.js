let nodemailer = require('nodemailer')
let config = require('../config')
config=config.mail
const params = {
    host: 'smtp.mxhichina.com', // 设置服务
    port: 465, // 端口
    sercure: true, // 是否使用TLS，true，端口为465，否则其他或者568
    auth: {
        user: config.user, // 邮箱和密码
        pass: config.emailPwd
    }
}
  // 邮件信息
//   const mailOptions = {
//     from: config.user, // 发送邮箱
//     to: config.emailTo, // 接受邮箱
//     subject: config.title, // 标题
//     html: config.html // 内容
//   }
let template={
  text(option){
    let data=option.data;
    let auto={
      from:config.user,
    }
    return {...auto,...option.option}
  }
}
  // 发送邮件
  const transporter = nodemailer.createTransport(params)
  function sendMail(params){
    return new Promise(function (resolve, reject) {
      transporter.sendMail(template[params.type](params),function(err,res){
        if(err){
          resolve(0)
        }else{
          resolve(res)
        }
      });
    })
  }

module.exports = sendMail;