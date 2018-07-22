/**
 * Created by ChengZheLin on 2018/7/20.
 */

'use strict';
function safety () {
    return async (ctx, next) => {
        /*try {

            /!*ctx.response.status = 403;
            ctx.response.body = '403 请求非法！';*!/
        } catch (err) {
            // handle err
        }*/
        //console.log(ctx.params)
        await next()
    }
}

function verificationId (id) {
    return /^(all|\d{1,2})$/.test(id)
}

module.exports = {
    safety,
    verificationId
};
