/**
 * Created by ChengZheLin on 2018/7/20.
 */

const mysql = require('mysql2/promise');
const {database} = require('../config');

async function query (sql) {
    const connection = await mysql.createConnection({
        ...database
    });

    let [rows] = await connection.execute(sql);

    connection.end();
    rows = JSON.stringify(rows);

    return JSON.parse(rows)
}

// 查询成员信息
async function queryMemberInfo (id) {
    let data = {};

    let sql = `SELECT 
                rg_member.*, 
                rg_day.baidu_index, 
                rg_day.xunyi_index,
                rg_day.weibo_index,
                rg_day.weibo_power,
                rg_hour.baike_browse,
                rg_hour.baike_flowers,
                rg_hour.weibo_forward,
                rg_hour.weibo_comment,
                rg_hour.weibo_like,
                rg_hour.weibo_fans,
                rg_hour.doki_fans
                FROM laimeiyun_data.rg_member AS rg_member, 
                laimeiyun_data.rg_day AS rg_day, 
                laimeiyun_data.rg_hour AS rg_hour
                WHERE rg_member.id = rg_hour.id
                AND rg_member.id = rg_day.id
                ${ id ? 'AND rg_member.id = ' + id : '' }
                ORDER BY rg_hour.create_date desc, rg_day.create_date desc 
                LIMIT ${ id ? 1 : 12 }`;
    data.list = await query(sql);
    return data
}

// 查询成员每日数据
async function queryMemberDayData (id, type) {
    let page_size = 1;
    switch (type) {
        case 'month':
            page_size = 30;
            break;
        case 'week':
            page_size = 7;
            break;
    }

    let data = {};
    data[id] = await query(
        `SELECT create_date,baidu_index,xunyi_index,weibo_index,weibo_power 
        FROM laimeiyun_data.rg_day 
        WHERE id = ${id} 
        ORDER BY create_date desc LIMIT 0,${page_size}`);

    return data
}

// 查询成员24小时数据
async function queryMemberHourData (id) {

    let data = {};
    data[id] = await query(
        `SELECT 
        create_date,baike_browse,baike_flowers,weibo_forward,weibo_comment,weibo_like,weibo_fans,doki_fans 
        FROM laimeiyun_data.rg_hour 
        WHERE id = ${id} 
        ORDER BY create_date desc LIMIT 0,24`
    );

    return data
}


module.exports = {
    query,
    queryMemberInfo,
    queryMemberDayData,
    queryMemberHourData
};

if (require.main === module) {
    (async () => {
        let data = await queryMemberDayData(1);
        console.log(data)
    })()
}
