/**
 * Created by ChengZheLin on 2018/7/19.
 */


const Router = require('koa-router');
const router = new Router();

const request = require('request');

let {version} = require('../config');
router.prefix(`/${version}/member`);

// 获取所有成员信息
router.get('/', async (ctx, next) => {
    let data = null;
    try {
        data = await request({
            url: 'http://data.weibo.com/index/ajax/newindex/getchartdata',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Accept-Encoding': 'gzip, deflate',
                'Accept-Language': 'zh-CN,zh;q=0.9',
                'Connection': 'keep-alive',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cookie': 'WEB3=b990dec549c6772236fae0d6b4c2d198',
                'Origin': 'http://data.weibo.com',
                'Referer': 'http://data.weibo.com/index/newindex?visit_type=trend&wid=1020000005811',
                'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
                'X-Requested-With': 'XMLHttpRequest'
            },
            formData: {
                wid: 1020000005811,
                dateGroup: '1hour'
            }
        });
    } catch (e) {
        data = e
    }

    ctx.body = data.code
});


// 获取指定成员信息
router.get('/:id', async (ctx, next) => {
    ctx.body = {
        id: ctx.params.id
    }
});

module.exports = router;
