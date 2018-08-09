/**
 * Created by ChengZheLin on 2018/7/19.
 */

const config = require('./config');
// const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyParser = require('koa-bodyparser');
const helmet = require("koa-helmet");
const { safety } = require("./bin/safety");
const cache = require("./bin/cache");
const Koa = require('koa');
const app = new Koa();
const { formatTimeStamp } = require("./tools/tools");

// 打印日志
app.use(async (ctx, next) => {
    const start = Date.now();
    // ctx.throw(403, { message: 'Forbidden' });
    await next();
    const ms = Date.now() - start;

    ctx.set('X-Response-Time', `${ms}ms`);
});

app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    console.log(`[${formatTimeStamp(new Date().getTime(), 'yyyy-MM-dd hh:mm:ss')}] ${ctx.method} ${ctx.url} - ${ms}ms`);
});

// 中间件
app.use(cache());
app.use(helmet());
app.use(bodyParser({multipart: true}));
// app.use(json());
onerror(app);

// 路由
const member = require('./routes/ApiMember');
const fast = require('./routes/ApiFast');
const day = require('./routes/ApiDay');
const hour = require('./routes/ApiHour');
const newstar = require('./routes/ApiStar');
const proxy = require('./routes/ApiProxy');
app.use(member.routes(), member.allowedMethods());
app.use(fast.routes(), fast.allowedMethods());
app.use(day.routes(), day.allowedMethods());
app.use(hour.routes(), hour.allowedMethods());
app.use(newstar.routes(), newstar.allowedMethods());
app.use(proxy.routes(), proxy.allowedMethods());

// 错误监听
app.on('error', (err, ctx) => {
    console.error('server error', err, ctx)
});

// 缓存数据
/*app.use(async ctx => {
    console.log(111, ctx.path)
});*/


app.listen(config.port);
