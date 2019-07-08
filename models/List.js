const db = require('../db');

module.exports = db.defineModel('list', {
    uid:db.STRING(50),
    item_id: db.STRING(100),
    props:db.STRING(100),
    skuId:db.STRING(20),
    email: db.STRING(30),
    price:db.BIGINT,
    phone:db.STRING(20),
    state:{
        type:db.BIGINT,
        defaultValue:0
    },
});