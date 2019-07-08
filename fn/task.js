const getGood = require('./getGood');
const schedule = require("node-schedule");
const sendMail = require('./mail');
const {formatPrice,parseTime} = require('./public');
const Good = require('../models/Good');
const List = require('../models/List');
const config = require('../config');

module.exports = ()=>{
    schedule.scheduleJob('0 10 0 * * *', async function () {
        sendMail({
            type:"text",
            option:{
                to:config.mail.admin,
                subject:`定时任务`,
                html:`开始了`
            }
        })
        const date=parseTime(new Date().getTime(), "{y}-{m}-{d}");
        const list_findAll = await List.findAll({
            where: {
                state: 0,
            }
        });
        let list_obj={}
        list_findAll.map(item=>{
            if(!list_obj[item.item_id]){
                list_obj[item.item_id]=[]
            }
            list_obj[item.item_id].push(item)
        })
        let change_list=[]
        let change_good=[]
        for(let i in list_obj){
            const good_findAll = await Good.findAll({
                where: {
                    item_id: i,
                    date
                }
            });
            if(good_findAll.length==0){
                let good_result = await getGood(i)
                if(good_result){
                    try {
                        let skuId_obj={}
                        let good_data = JSON.parse(good_result.data.apiStack[0].value)
                        good_data.skuBase.skus.map((item) => {
                            for (let n in good_data.skuCore.sku2info) {
                                if (n == item.skuId) {
                                    item = Object.assign(item, good_data.skuCore.sku2info[n])
                                }
                            }
                            skuId_obj[item.skuId]=item.price.priceMoney
                        })
                        good_data.skuBase.title = good_result.data.item.title
                        change_good.push({
                            item_id:i,
                            detail: JSON.stringify(good_data.skuBase),
                        })
                        for(let n of list_obj[i]){
                            if(skuId_obj[n.skuId]<=n.price){
                                change_list.push(n.id);
                                //发邮件
                                const mail=await sendMail({
                                    type:"text",
                                    option:{
                                        to:n.email,
                                        subject:`商品降价通知通知`,
                                        html:`您关注的淘宝商品 ${good_data.skuBase.title} ${n.props} 价格已降至 ￥${formatPrice(skuId_obj[n.skuId])} <a href="https://item.taobao.com/item.htm?&id=${i}">立即抢购</a>`
                                    }
                                });
                            }
                        }
                    } catch (error) {
                        console.log(error)
                    }
                }
            }
        }
        change_good.length>0&&await Good.bulkCreate(change_good);
        change_list.length>0&&await List.update(
            {'state': 1},
            {
                'where': {
                    'id': change_list
                }
            }
        );
    });
};