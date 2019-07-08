const Good = require('../../models/Good');
const {parseTime} = require('../../fn/public');
const getGood = require('../../fn/getGood');
module.exports = {
    'POST /good': async (ctx, next) => {
        const date=parseTime(new Date().getTime(), "{y}-{m}-{d}");
        let item_id = ctx.request.body.id;
        if (!item_id) {
            ctx.body = {
                msg: "id不存在"
            };
            return
        }
        const good_findAll = await Good.findAll({
            where: {
                item_id: item_id,
                date
            }
        });
        if (good_findAll.length > 0) {
            ctx.body = {
                data:JSON.parse(good_findAll[good_findAll.length-1].detail)
            }
        } else {
            let good_result = await getGood(item_id)
            if (good_result) {
                let good_data = JSON.parse(good_result.data.apiStack[0].value)
                good_data.skuBase.skus.map((item) => {
                    for (let n in good_data.skuCore.sku2info) {
                        if (n == item.skuId) {
                            item = Object.assign(item, good_data.skuCore.sku2info[n])
                        }
                    }
                })
                good_data.skuBase.title = good_result.data.item.title
                await Good.create({
                    item_id,
                    detail: JSON.stringify(good_data.skuBase),
                    date
                });
                ctx.body = {
                    data:good_data.skuBase
                };
                
            } else {
                ctx.body = {
                    msg: "远程服务器请求失败"
                };
                return
            }
        }
    },
    'GET /good/:item_id': async (ctx, next) => {
        const {
            item_id
        } = ctx.params;
        const good_findAll = await Good.findAll({
            where: {
                item_id: item_id,
            }
        });
        let data = good_findAll.map((item) => {
            return {
                item_id: item.item_id,
                detail: JSON.parse(item.detail),
                date:item.date
            }
        })
        ctx.body = {data};
    },
};