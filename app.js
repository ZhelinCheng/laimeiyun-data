/**
 * Created by ChengZheLin on 2018/7/19.
 */

const config = require('./config');
// const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyParser = require('koa-bodyparser');
const helmet = require("koa-helmet");
const safety = require("./bin/safety");
const Koa = require('koa');
const app = new Koa();

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

    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// 中间件
 app.use(safety());
app.use(bodyParser({multipart: true}))
// app.use(json());
app.use(helmet());
onerror(app);

// 路由
const member = require('./routes/member');
const fast = require('./routes/fast');
const day = require('./routes/day');
const hour = require('./routes/hour');
app.use(member.routes(), member.allowedMethods());
app.use(fast.routes(), fast.allowedMethods());
app.use(day.routes(), day.allowedMethods());
app.use(hour.routes(), hour.allowedMethods());

// 错误监听
app.on('error', (err, ctx) => {
    console.error('server error', err, ctx)
});


// response
app.use(async ctx => {
    ctx.body = 'Hello World';
});


app.listen(config.port);
