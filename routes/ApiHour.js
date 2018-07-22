/**
 * Created by ChengZheLin on 2018/7/19.
 */

const Router = require('koa-router');
const router = new Router();

let {version} = require('../config');
router.prefix(`/${version}/hour`);

const { queryMemberHourData } = require('../database/mysql.js');
const { verificationId } = require("../bin/safety");

// 获取指定成员小时数据24h
router.get('/:id', async (ctx, next) => {
    if (verificationId(ctx.params.id) && !ctx.body) {
        ctx.body = await queryMemberHourData(ctx.params.id);
    }
    await next();
});

module.exports = router;
