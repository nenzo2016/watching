const List = require('../../models/List');
const request = require('../../fn/request');
const {checkPrice,email_reg} = require('../../fn/public');
const querystring = require('querystring');
module.exports = {
    'POST /list': async (ctx, next) => {
        let {skuId,item_id,props,email,price} = ctx.request.body;
        price=Number(price)
        if(!item_id||!skuId||!props||!email||!price||!checkPrice(price)||!email_reg(email)){
            ctx.body={msg:"参数不正确"};
            return
        }
        const list_findAll = await List.findAll({
            where: {
                item_id,
                skuId,
                email
            }
        });
        if(list_findAll.length>0){
            let list_update= await List.update(
                {state:0,props,price},
                {where: {item_id,skuId,email}}
            );
            if(list_update[0]==1){
                ctx.body={}
            }else{
                throw "数据错误"
            }
        }else{
            const list_create = await List.create({skuId,item_id,props,email,price});
            if(list_create){
                ctx.body={};
            }else{
                throw "数据错误"
            }
        }
    },
};