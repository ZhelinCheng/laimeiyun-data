/**
 * Created by ChengZheLin on 2018/7/19.
 */


const Router = require('koa-router');
const router = new Router();

let {version} = require('../config');
router.prefix(`/${version}/member`);

// 获取所有成员信息
router.get('/', async (ctx, next) => {

});


// 获取指定成员信息
router.get('/:id', async (ctx, next) => {
    ctx.body = {
        id: ctx.params.id
    }
});

module.exports = router;
