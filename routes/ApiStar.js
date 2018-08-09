/**
 * Created by ChengZheLin on 2018/8/6.
 */

'use strict';

const Router = require('koa-router');
const router = new Router();
const xlsx = require('node-xlsx').default;

let {version} = require('../config');
router.prefix(`/${version}/newstar`);

const {queryNewStarData} = require('../database/mysql.js');
const fs = require('fs');
let key = fs.readFileSync('./key.txt').toString().split(/\r\n|\n/);
console.log(key[0]);

// 获取指定成员信息
router.get('/:type/:key', async (ctx, next) => {
  let type = ctx.params.type;
  if (ctx.params.key === key[0] && /^(all|new)$/.test(type)) {
    let data = await queryNewStarData(type);
    let items = [['日期', '微博昵称', '排名', '总评分', '阅读数', '阅读评分', '互动值', '互动评分' , '社会影响力', '影响力评分', '爱慕值', '爱慕值评分']];
    let len = data.length;
    for (let i = 0; i < len; i++) {
      let item = data[i];
      let inner = [];
      for (let key of Object.keys(item)) {
        inner.push(item[key])
      }
      items.push(inner)
    }
    let fileName = `New Star ${type} ${new Date().getTime()}`;
    ctx.body = xlsx.build([{name: fileName, data: items}]);
    await next();
    ctx.set('Content-Disposition', `attachment; filename="${fileName}.xlsx"`);
  } else {
    ctx.body = ''
  }
});

module.exports = router;