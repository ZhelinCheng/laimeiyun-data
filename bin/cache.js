/**
 * Created by ChengZheLin on 2018/7/22.
 */

'use strict';

let SAVE_CACHE = {};

function cache() {
    return async (ctx, next) => {
        let now = new Date().getTime();
        let data = SAVE_CACHE[ctx.path];
        if (data) {
            if (now - data.date < 30000) {
                ctx.body = data.data;
            } else {
                data = false;
                delete SAVE_CACHE[ctx.path]
            }
        }

        await next();

        if (!data) {
            // 没有缓存
            SAVE_CACHE[ctx.path] = {
                date: now,
                data: ctx.body
            }
        }
    }
}

module.exports = cache;
