/**
 * Created by ChengZheLin on 2018/7/19.
 */

const Router = require('koa-router');
const router = new Router();

let {version} = require('../config');
router.prefix(`/${version}/member`);

const { queryMemberInfo } = require('../database/mysql.js');

// 获取指定成员信息
router.get('/', async (ctx, next) => {
    let data = await queryMemberInfo(ctx.query.id);
    next();
    ctx.body = data
});

module.exports = router;
