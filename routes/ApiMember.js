/**
 * Created by ChengZheLin on 2018/7/19.
 */

const Router = require('koa-router');
const router = new Router();

let {version} = require('../config');
router.prefix(`/${version}/member`);

const {queryMemberInfo, queryMemberBase} = require('../database/mysql.js');
const { verificationId } = require("../bin/safety");


// 获取指定成员信息
router.get('/info/:id', async (ctx, next) => {
    let data = {};
    let id = ctx.params.id;
    if (verificationId(id)) {
        data = await queryMemberInfo(id);
    }
    next();
    ctx.body = data
});

// 获取指定成员基本信息
router.get('/base/:id', async (ctx, next) => {
    let data = {};
    let id = ctx.params.id;
    if (verificationId(id)) {
        data = await queryMemberBase(id);
    }

    next();
    ctx.body = data
});


module.exports = router;
