module.exports = {
    port:9527,
    sequelize:{
        dialect: 'mysql',
        database: '*',
        username: '*',
        password: '*',
        host:'*',//ip
        port: "*"
    },
    mail:{
        user:"support@madao.online",// 发件者的邮箱和密码，需开启相关功能
        emailPwd:"*",
        admin:"*"//自己的邮箱
      }
};