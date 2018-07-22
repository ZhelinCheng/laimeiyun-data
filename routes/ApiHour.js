/**
 * Created by ChengZheLin on 2018/7/19.
 */

const Router = require('koa-router');
const router = new Router();

let {version} = require('../config');
router.prefix(`/${version}/hour`);

const { queryMemberHourData } = require('../database/mysql.js');

// 缓存数据
let SAVE_DATA = {};

// 获取指定成员小时数据24h
router.get('/:id', async (ctx, next) => {
    let data = await queryMemberHourData(ctx.params.id);
    next();
    ctx.body = data
});

module.exports = router;
