/**
 * Created by ChengZheLin on 2018/7/20.
 */

const mysql = require('mysql2/promise');
const {database} = require('../config');

async function query (sql, cb) {
    const connection = await mysql.createConnection({
        ...database
    });

    let [rows] = await connection.execute(sql);


    rows = JSON.stringify(rows);
    rows = rows.replace(/\\"/img, '"').replace(/"{/img, '{').replace(/}"/img, '}');

    if (typeof cb === 'function') {
        return await cb(JSON.parse(rows), connection)
    } else {
        connection.end();
        return JSON.parse(rows)
    }
}

// 查询成员信息
async function queryMemberInfo (id) {
    if (id === 'all') id = null;

    let data = {};

    let sql = `SELECT 
                rg_member.id, 
                rg_member.name, 
                rg_member.head_pic, 
                rg_member.weibo_index_id, 
                
                UNIX_TIMESTAMP(rg_hour.create_date) AS create_hour,
                rg_hour.baike_browse,
                rg_hour.baike_flowers,
                rg_hour.weibo_forward,
                rg_hour.weibo_comment,
                rg_hour.weibo_like,
                rg_hour.weibo_fans,
                rg_hour.doki_fans,
                
                UNIX_TIMESTAMP(rg_day.create_date) AS create_day,
                rg_day.weibo_ring,
                rg_day.weibo_total,
                rg_day.weibo_read,
                rg_day.weibo_int,
                rg_day.weibo_inf,
                rg_day.weibo_love,
                rg_day.weibo_index
                
                FROM laimeiyun_data.rg_member AS rg_member, 
                laimeiyun_data.rg_day AS rg_day, 
                laimeiyun_data.rg_hour AS rg_hour
                WHERE rg_member.id = rg_hour.id
                AND rg_member.id = rg_day.id
                ${ id ? 'AND rg_member.id = ' + id : '' }
                ORDER BY rg_day.create_date desc, rg_hour.create_date desc, rg_member.id
                LIMIT ${ id ? 1 : 11 }`;



    let timeStamp = new Date(new Date().setHours(0, 0, 0, 0)) / 1000;
    let date = new Date();
    if (date.getHours() <= 10) {
       if (date.getMinutes() <= 7) {
           timeStamp = timeStamp - 86400;
       }
    }

    data.list = await query(sql, async (items, connection)=> {
        let saveData = items.map(async item => {
            let [rows] = await connection.execute(
                `SELECT 

                UNIX_TIMESTAMP(rg_hour.create_date) AS create_hour,
                rg_hour.baike_browse,
                rg_hour.baike_flowers,
                rg_hour.weibo_forward,
                rg_hour.weibo_comment,
                rg_hour.weibo_like,
                rg_hour.weibo_fans,
                rg_hour.doki_fans,
                
                UNIX_TIMESTAMP(rg_day.create_date) AS create_day,
                rg_day.weibo_ring,
                rg_day.weibo_total,
                rg_day.weibo_read,
                rg_day.weibo_int,
                rg_day.weibo_inf,
                rg_day.weibo_love,
                rg_day.weibo_index
                
                FROM laimeiyun_data.rg_member AS rg_member, 
                laimeiyun_data.rg_day AS rg_day, 
                laimeiyun_data.rg_hour AS rg_hour
                WHERE 
					 rg_member.id = ${item.id}
					 AND UNIX_TIMESTAMP(rg_day.create_date) < ${timeStamp}
					 AND rg_member.id = rg_hour.id
                AND rg_member.id = rg_day.id
                
                ORDER BY rg_hour.create_date desc
                LIMIT 1,1`
            );

            rows = JSON.stringify(rows);
            rows = rows.replace(/\\"/img, '"').replace(/"{/img, '{').replace(/}"/img, '}');
            item.prev_data = JSON.parse(rows)[0];
            return item
        });
        let saveList = [];
        for (const itemPromise of saveData) {
            saveList.push(await itemPromise)
        }
        connection.end();
        return saveList;
    });
    return data
}

// 查询成员基本信息
async function queryMemberBase (id) {
    if (id === 'all') id = null;
    let data = {};

    let sql = `SELECT *
                FROM laimeiyun_data.rg_member AS rg_member
                ${ id ? 'WHERE rg_member.id = ' + id : '' }
                LIMIT ${ id ? 1 : 11 }`;
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
    data['list'] = await query(
        `SELECT 
        id,
        UNIX_TIMESTAMP(create_date) AS create_date,
        weibo_ring,weibo_total,weibo_read,weibo_int,weibo_inf,weibo_love,weibo_index
        FROM laimeiyun_data.rg_day 
        WHERE id = ${id} 
        ORDER BY create_date desc 
        LIMIT 0,${page_size}`);

    return data
}

// 查询成员24小时数据
async function queryMemberHourData (id) {

    let data = {};
    data['list'] = await query(
        `SELECT 
        id,
        UNIX_TIMESTAMP(create_date) AS create_date,
        baike_browse,baike_flowers,weibo_forward,weibo_comment,weibo_like,weibo_fans,doki_fans
        FROM laimeiyun_data.rg_hour 
        WHERE id = ${id} 
        ORDER BY create_date desc LIMIT 0,24`
    );

    return data
}


module.exports = {
    query,
    queryMemberBase,
    queryMemberInfo,
    queryMemberDayData,
    queryMemberHourData
};

if (require.main === module) {
    (async () => {
        let data = await queryMemberDayData(1, 'month');
        console.log(data)
    })()
}
