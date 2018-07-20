/**
 * Created by ChengZheLin on 2018/7/20.
 */

'use strict';
function safety () {
    return async (ctx, next) => {
        try {
            ctx.query.id = parseInt(ctx.query.id);
            console.log(!ctx.query.id);

            if (!ctx.query.id) {
                ctx.response.status = 403;
                ctx.response.body = '403 请求非法！';
            } else {
                await next()
            }
        } catch (err) {
            // handle err
        }
    }
}

module.exports = safety;

/*
module.exports = async (ctx, next) => {
    if (!ctx.query.id) {
        ctx.response.status = 404;
        ctx.response.body = 'Page Not Found';
    }
    //await next();
}*/
