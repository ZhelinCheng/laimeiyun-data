/**
 * Created by ChengZheLin on 2018/7/19.
 */


const Router = require('koa-router');
const router = new Router();

const rp = require('../bin/request');

let {version} = require('../config');
router.prefix(`/${version}/fast`);

// 缓存数据

let SAVE_DATA = {
    weibo: {}
};


// 获取所有成员信息
router.get('/weibo/:id', async (ctx, next) => {
    let data = await rp({
        url: 'http://data.weibo.com/index/ajax/newindex/getchartdata',
        method: 'POST',
        formData: {
            wid: 1020000005811,
            dateGroup: '1hour'
        }
    }, 'http://data.weibo.com/index/newindex');


    ctx.body = data;

});

module.exports = router;
