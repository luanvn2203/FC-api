const db = require('./db');
const helper = require('../helper');

async function createAds(title, content, imageLink, startDate, endDate, donorId, target_url, expected_using_point) {
    try {
        const sql = `INSERT INTO tbl_advertisement( title, content, imageLink, startDate, endDate, donorId,target_url,expected_using_point) 
    value(?,?,?,?,?,?,?,?)`;
        const params = [
            `${title}`,
            `${content}`,
            `${imageLink}`,
            `${startDate}`,
            `${endDate}`,
            `${donorId}`,
            `${target_url}`,
            expected_using_point
        ]
        const result = await db.query(sql, params)
        if (result.affectedRows) {
            return true
        } else {
            return false
        }
    } catch (error) {
        console.log(error.message)
    }
}

async function getAdvertiseById(advertiseId) {
    try {
        const sql = `SELECT id, title, content, imageLink, startDate, endDate, donorId,target_url from tbl_advertisement where id = ? and statusId != 5`;
        const params = [
            `${advertiseId}`,
        ]
        const result = await db.query(sql, params)
        const data = helper.emptyOrRows(result)
        return data
    } catch (error) {
        console.log(error.message)
    }
}

async function updateAdvertise(id, title, content, imageLink, startDate, endDate, target_url, expected_using_point) {
    try {
        const sql = `UPDATE tbl_advertisement set 
                    title = ? ,
                    content = ?,
                    imageLink = ?,
                    startDate = ?,
                    endDate = ?,
                    target_url = ?,
                    expected_using_point = ?
                    where id = ?`;
        const params = [
            `${title}`,
            `${content}`,
            `${imageLink}`,
            `${startDate}`,
            `${endDate}`,
            `${target_url}`,
            expected_using_point,
            `${id}`,

        ]
        const result = await db.query(sql, params)
        if (result.affectedRows) {
            return true
        } else {
            return false
        }
    } catch (error) {
        console.log(error.message)
    }
}

async function updateAdvertiseStatus(advertiseId, status) {
    try {
        const sql = `Update tbl_advertisement set statusId = ? where id = ?`;
        const params = [
            `${status}`,
            `${advertiseId}`
        ]
        const result = await db.query(sql, params)
        if (result.affectedRows) {
            return true
        } else {
            return false
        }
    } catch (error) {
        console.log(error)
    }
}

async function getAllAdvertiseByEmail(email) {
    try {

        const sql = `SELECT a.id, a.title, a.content, a.imageLink, a.startDate, a.endDate, a.donorId, a.target_url , a.expected_using_point , ass.status  as statusName
        from tbl_advertisement a , tbl_ads_status ass
        where a.statusId = ass.id and a.donorId = ? and a.statusId != 5`;
        const params = [
            `${email}`
        ]
        const result = await db.query(sql, params)
        const data = helper.emptyOrRows(result)
        return data
    } catch (error) {
        console.log(error)
    }
}

async function getAllAdvertiseByAdmin() {
    try {

        const sql = `SELECT a.id, a.title, a.content, a.imageLink, a.startDate, a.endDate, a.donorId, a.target_url, a.expected_using_point, ass.status  as statusName
        from tbl_advertisement a , tbl_ads_status ass
        where a.statusId = ass.id and a.statusId != 5`;
        const result = await db.query(sql)
        const data = helper.emptyOrRows(result)
        return data
    } catch (error) {
        console.log(error)
    }
}

async function updateExpectedPoint(id, point, isMinus) {
    try {
        let sql = `Update tbl_advertisement set expected_using_point = (expected_using_point - ?) where id  = ? `
        if (isMinus === false) {
            sql = `Update tbl_advertisement set expected_using_point = (expected_using_point + ?) where id  = ?`
        }
        const params = [
            `${point}`,
            `${id}`
        ]
        const result = await db.query(sql, params)
        if (result.affectedRows) {
            return true
        } else {
            return false
        }
    } catch (error) {
        console.log(error)
    }
}

async function adsForRendering() {
    try {
        const sql = `select id, title, content, imageLink, startDate, endDate, donorId, statusId, target_url, expected_using_point from tbl_advertisement
        where statusId = 2 
        and endDate > current_timestamp
        and startDate < current_timestamp
        and expected_using_point > 0
        order by rand() limit 1`;
        const result = await db.query(sql)
        const data = helper.emptyOrRows(result)
        return data


    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    createAds,
    getAdvertiseById,
    updateAdvertise,
    updateAdvertiseStatus,
    getAllAdvertiseByEmail,
    getAllAdvertiseByAdmin,

    updateExpectedPoint,
    adsForRendering
}