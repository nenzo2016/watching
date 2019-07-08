const {parseTime} = require('../../fn/public');
const request = require('../../fn//request');
module.exports = {
    'GET /subject': async (ctx, next) => {
        const {date=parseTime(new Date().getTime(), "{y}-{m}-{d}")} = ctx.query;
        let parseDate=date.split('-');
        let subjectArr=[];
        for(let i =0;i<5;i++){
            let subject = await request({
                url: `http://www.cn.sudokupuzzle.org/online2.php?nd=${i}&y=${parseDate[0]}&m=${parseDate[1]}&d=0${parseDate[2]}`,
                method: 'GET',
            });
            if(subject){
                let reg=/tmda=\'[0-9]+?\'/;
                let match=subject.match(reg);
                if(match){
                    let num_reg=/[0-9]+/g;
                    subjectArr.push(match[0].match(num_reg)[0])
                }
            }
        }
        let parse_subject=subjectArr.map(item=>({
            initial:item.substring(0,81),
            result:item.substring(81,162)
        }))
        ctx.body = {
            data:{
                subject:parse_subject,
                date
            }
        };
    },
};