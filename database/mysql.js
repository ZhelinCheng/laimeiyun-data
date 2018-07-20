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

    let sql = `SELECT member.*, 
            day.baidu_index, 
            day.xunyi_index,
            day.weibo_index,
            day.weibo_power,
            hour.baike_browse,
            hour.baike_flowers,
            hour.weibo_forward,
            hour.weibo_comment,
            hour.weibo_like,
            hour.weibo_fans,
            hour.doki_fans
            FROM laimeiyun_data.member 
            LEFT JOIN laimeiyun_data.day
            ON member.id = day.id
            LEFT JOIN laimeiyun_data.hour
            ON day.id = hour.id
            ${id ? 'WHERE member.id =' + id : ''}
            ORDER BY hour.create_date desc 
            LIMIT ${id ? 1 : 12}
            `;

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
        FROM laimeiyun_data.day 
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
        FROM laimeiyun_data.hour 
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
