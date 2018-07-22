/**
 * Created by ChengZheLin on 2018/7/19.
 * 数据生存周期较短的接口
 */


const Router = require('koa-router');
const router = new Router();

const rp = require('../bin/request');

let {version} = require('../config');
router.prefix(`/${version}/fast`);

// 缓存数据

let SAVE_DATA = {};

// 获取微博小时数据接口
router.get('/weibo/:id', async (ctx, next) => {
    let id = ctx.params.id;
    if (/^\d{6,}$/.test(id) && !ctx.body) {
        let data = await rp({
            url: 'http://data.weibo.com/index/ajax/newindex/getchartdata',
            method: 'POST',
            formData: {
                wid: id,
                dateGroup: '1hour'
            }
        }, 'http://data.weibo.com/index/newindex');

        data = JSON.parse(data);

        let res = {list:[]};
        let html = data.html.match(/[+|\-]\d+\.?\d*%/img);

        for (let i in data.data) {
            let item = data.data[i];
            item.trend.ring = html[i];
            res.list.push(item.trend)
        }

        ctx.body = res;
    }

    await next();
});



module.exports = router;
