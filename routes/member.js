/**
 * Created by ChengZheLin on 2018/7/19.
 */

const Router = require('koa-router');
const router = new Router();

let {version} = require('../config');
router.prefix(`/${version}/member`);

const { queryMemberInfo, queryMemberBase } = require('../database/mysql.js');

// 获取指定成员信息
router.get('/info', async (ctx, next) => {
    let data = await queryMemberInfo(ctx.query.id);
    next();
    ctx.body = data
});

// 获取指定成员基本信息
router.get('/base', async (ctx, next) => {
    let data =null;
    try {
        data = await queryMemberBase(ctx.query.id);
    } catch (e) {
        console.log(e)
    }

    next();
    ctx.body = data
});


module.exports = router;
