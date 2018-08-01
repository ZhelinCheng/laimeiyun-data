/**
 * Created by ChengZheLin on 2018/7/19.
 */

const Router = require('koa-router');
const router = new Router();

let {version} = require('../config');
router.prefix(`/${version}/hour`);

const { queryMemberHourData } = require('../database/mysql.js');

// 获取指定成员小时数据24h/一个月
router.get('/:type/:id', async (ctx, next) => {
    let type = ctx.params.type;
    let id = ctx.params.id;
    if (/^(\d{1,2})$/.test(id) && /^(month|day)$/.test(type) && !ctx.body) {
        ctx.body = await queryMemberHourData(id, type);
    }
    await next();
});

module.exports = router;
