const Koa = require('koa');
const helmet = require('koa-helmet')
const bodyParser = require('koa-bodyparser');
const controller = require('./controller');
const config = require('./config');
const templating = require('./templating');
const {staticFiles,staticPages} = require('./static-files');
const path = require('path');
const task = require("./fn/task");
const app = new Koa();
const cors = require('koa2-cors');
const compress = require('koa-compress')
const isProduction = process.env.NODE_ENV === 'production';
const log4js = require("./log_config");
const errorLog = log4js.getLogger("errorLog"); //此处使用category的值
const resLog = log4js.getLogger("responseLog"); //此处使用category的值
//定时任务
task()
// parse request body:
app.use(bodyParser());

app.use(async (ctx, next) => {
    let log_model={
        ip:ctx.request.ip,
        method:ctx.request.method,
        header:ctx.request.header,
        href:ctx.request.href,
        query:ctx.query,
        body:ctx.request.body
    }
    try {
        //开始进入到下一个中间件
        await next();
        //记录响应日志
        resLog.info(JSON.stringify(log_model));
      } catch (error) {
        //记录异常日志
        if(!isProduction){
            console.log(error)
        }
        log_model.error=error.toString()
        errorLog.error(JSON.stringify(log_model));
        ctx.response.status = 500;
        ctx.body={msg:"系统错误"}
      }
});
//压缩
app.use(compress());
//helmet
app.use(helmet())
//跨域
app.use(cors());

// static file support:
app.use(staticFiles('/static/', __dirname + '/static'));
app.use(staticPages('/pages/',path.resolve(__dirname,"../pages") ));
app.use(templating('./views', {
    noCache: !isProduction,
    watch: !isProduction
}));
// add controller:
app.use(controller());
app.listen(config.port,"0.0.0.0");
console.log(`run in ${config.port}`,`isProduction:${isProduction}`)