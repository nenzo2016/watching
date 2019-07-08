const request = require('./request');
module.exports=function(item_id) {
    return new Promise(async function(resolve, reject){
        let good_result=await request({
            url:`https://h5api.m.taobao.com/h5/mtop.taobao.detail.getdetail/6.0/?type=json&data=${encodeURIComponent(`{"id":"${item_id}","itemNumId":"${item_id}","exParams":"{\"id\":\"${item_id}\"}","detail_v":"8.0.0","utdid":"1"}`)}`,
            method: 'GET',
            https:true
        });
        resolve(good_result)
    })
}