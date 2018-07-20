/**
 * Created by ChengZheLin on 2018/7/19.
 */

const Router = require('koa-router');
const router = new Router();

let {version} = require('../config');
router.prefix(`/${version}/day`);

const { queryMemberDayData } = require('../database/mysql.js');

// 获取指定成员天数据
router.get('/', async (ctx, next) => {
    let data = await queryMemberDayData(ctx.query.id, ctx.query.type);
    next();
    ctx.body = data
});

module.exports = router;
