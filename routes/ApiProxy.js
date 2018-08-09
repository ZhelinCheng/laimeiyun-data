/**
 * Created by ChengZheLin on 2018/8/7.
 */

const Router = require('koa-router');
const router = new Router();
const rp = require('request-promise-native');
const fs = require('fs');
let key = fs.readFileSync('./key.txt').toString().split(/\r\n|\n/);
console.log(key[1]);

let {version} = require('../config');
router.prefix(`/${version}/proxy`);


// 获取指定成员基本信息
router.post('/test', async (ctx, next) => {
    ctx.body = {
        time: new Date().getTime()
    };
    await next();
});

let saveData = {
    time: 0,
    data: {}
};

router.get('/ip/:key', async (ctx, next) => {
    let time = new Date().getTime();
    if (ctx.params.key === key[1] && !ctx.body) {
        if (time - saveData.time > 3 * 60 * 1000) {
            let data = await rp({
                url: 'http://api.ip.data5u.com/socks/get.html?order=c8d7e0ae61e6e935125e3bf0d8a2b5dd&ttl=1&json=1&random=true&type=1&sep=3'
            });
            data = JSON.parse(data);

            if (!data.success) {
                saveData.data = {
                    url: '',
                    timeout: time
                };
            } else {
                data = data.data[0];
                saveData.data = {
                    url: `http://${data.ip}:${data.port}`,
                    timeout: new Date(data.outTime).getTime()
                };
            }

            saveData.time = time;
        }

        ctx.body = saveData.data;
    } else if (ctx.params.key !== key[1]) {
        ctx.body = {
            url: '',
            msg: '非法请求'
        }
    }
    await next();
});

module.exports = router;