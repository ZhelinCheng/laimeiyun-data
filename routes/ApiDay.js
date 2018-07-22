/**
 * Created by ChengZheLin on 2018/7/19.
 */

const Router = require('koa-router');
const router = new Router();

let {version} = require('../config');
router.prefix(`/${version}/day`);

const { queryMemberDayData } = require('../database/mysql.js');


// 获取指定成员天数据
router.get('/:type/:id', async (ctx, next) => {
    let type = ctx.params.type;
    let id = ctx.params.id;
    if (/^(\d{1,2})$/.test(id) && /^(month|week)$/.test(type) && !ctx.body) {
        ctx.body = await queryMemberDayData(id, type);
    }

    await next();
});

module.exports = router;
