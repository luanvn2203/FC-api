const db = require('./db');
const helper = require('../helper');

async function createAds(title, content, imageLink, startDate, endDate, donorId, target_url, expected_using_point, time_rendering) {
    try {
        const sql = `INSERT INTO tbl_advertisement( title, content, imageLink, startDate, endDate, donorId,target_url,expected_using_point,time_rendering) 
    value(?,?,?,?,?,?,?,?,?)`;
        const params = [
            `${title}`,
            `${content}`,
            `${imageLink}`,
            `${startDate}`,
            `${endDate}`,
            `${donorId}`,
            `${target_url}`,
            expected_using_point,
            time_rendering
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
        const sql = `SELECT id, title, content, imageLink, startDate, endDate, donorId,target_url,statusId, expected_using_point,time_rendering from tbl_advertisement where id = ? and statusId != 4`;
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

async function updateAdvertise(id, title, content, imageLink, startDate, endDate, target_url, expected_using_point, time_rendering) {
    try {
        const sql = `UPDATE tbl_advertisement set 
                    title = ? ,
                    content = ?,
                    imageLink = ?,
                    startDate = ?,
                    endDate = ?,
                    target_url = ?,
                    expected_using_point = ?,
                    time_rendering = ?
                    where id = ?`;
        const params = [
            `${title}`,
            `${content}`,
            `${imageLink}`,
            `${startDate}`,
            `${endDate}`,
            `${target_url}`,
            expected_using_point,
            time_rendering,
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

        const sql = `SELECT a.id, a.title, a.content, a.imageLink, a.startDate, a.endDate, a.donorId, a.target_url , a.expected_using_point ,a.time_rendering , ass.status  as statusName
        from tbl_advertisement a , tbl_ads_status ass
        where a.statusId = ass.id and a.donorId = ? and a.statusId != 4`;
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

        const sql = `SELECT a.id, a.title, a.content, a.imageLink, a.startDate, a.endDate, a.donorId, a.target_url, a.expected_using_point, a.time_rendering, a.statusId, ass.status  as statusName
        from tbl_advertisement a , tbl_ads_status ass
        where a.statusId = ass.id and a.statusId != 4`;
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
        const sql = `select id, title, content, imageLink, startDate, endDate, donorId, statusId, target_url, expected_using_point, time_rendering from tbl_advertisement
        where statusId = 2 
        and endDate > current_timestamp
        and startDate < current_timestamp
        and time_rendering > 0
        order by rand() limit 1`;
        const result = await db.query(sql)
        const data = helper.emptyOrRows(result)
        return data


    } catch (error) {
        console.log(error)
    }
}

async function updateTimeRendering(id, point, isMinus) {
    try {
        let sql = `Update tbl_advertisement set time_rendering = (time_rendering - ?) where id  = ? `
        if (isMinus === false) {
            sql = `Update tbl_advertisement set time_rendering = (time_rendering + ?) where id  = ?`
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

async function getRunningAdsWithExpiredEndDate(advertiseId) {
    try {
        const sql = `SELECT id, title, content, imageLink, startDate, endDate, donorId,target_url,statusId,
        expected_using_point,time_rendering from tbl_advertisement where id = 1 and statusId != 4 
        and endDate < current_timestamp`;
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

module.exports = {
    createAds,
    getAdvertiseById,
    updateAdvertise,
    updateAdvertiseStatus,
    getAllAdvertiseByEmail,
    getAllAdvertiseByAdmin,

    updateExpectedPoint,
    adsForRendering,
    updateTimeRendering,
    getRunningAdsWithExpiredEndDate,
}