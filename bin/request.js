/**
 * Created by ChengZheLin on 2018/7/19.
 */

'use strict';

const rp = require('request-promise-native');

const request = async function (params, referer) {
    return await rp({
        ...params,
        headers: {
            'Accept': 'application/json',
            'Accept-Language': 'zh-CN,zh;q=0.9',
            'Connection': 'keep-alive',
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
            'X-Requested-With': 'XMLHttpRequest',
            'Referer': referer
        }
    });
};

module.exports = request;

if (require.main === module) {
    (async ()=> {
        let data = await request({
            url: 'http://data.weibo.com/index/ajax/newindex/getchartdata',
            method: 'POST',
            formData: {
                wid: 1020000005811,
                dateGroup: '1hour'
            }
        }, 'http://data.weibo.com/index/newindex');

        console.log(data)
    })()
}

