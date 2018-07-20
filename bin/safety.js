/**
 * Created by ChengZheLin on 2018/7/20.
 */

'use strict';

function safety () {
    return async function (ctx, next) {
        try {
            // do something
            await next()
            // do something
        } catch (err) {
            // handle err
        }
    }
}

module.exports = safety;