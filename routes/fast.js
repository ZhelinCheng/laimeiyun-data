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

// 获取数据方法


// 获取微博小时数据接口
router.get('/weibo', async (ctx, next) => {
    if (!SAVE_DATA.weibo) SAVE_DATA.weibo = {};

    let data = {};
    let id = ctx.query.id;
    let save = SAVE_DATA.weibo[id];
    let isGet = true;

    if (save) {
        if ( new Date().getTime() - SAVE_DATA.weibo[id].date < 300000) {
            data = SAVE_DATA.weibo[id].data;
            isGet = false;
        }
    }
    if (isGet) {
        SAVE_DATA.weibo[id] = {};
        SAVE_DATA.weibo[id].date = new Date().getTime();
        data = await rp({
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


        SAVE_DATA.weibo[id].data = res;
        data = SAVE_DATA.weibo[id].data;
    }

    await next();
    ctx.body = data;
});



module.exports = router;
