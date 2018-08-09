/**
 * Created by ChengZheLin on 2018/8/7.
 */

const Router = require('koa-router');
const router = new Router();
const rp = require('request-promise-native');

let {version} = require('../config');
router.prefix(`/${version}/proxy`);
let key = fs.readFileSync('key.txt').toString();

// 获取指定成员基本信息
router.post('/test', async (ctx, next) => {
    ctx.body = {
        time: new Date().getTime()
    };
    await next();
});

router.post('/ip/:key', async (ctx, next) => {
    if (ctx.params.key === key && !ctx.body) {
        ctx.body = await rp({
             url: 'http://gec.ip3366.net/api/?key=20180808185702582&getnum=1&anonymoustype=3&filter=1&area=1&order=2&formats=2&proxytype=1'
        });
    }
    await next();
});

module.exports = router;