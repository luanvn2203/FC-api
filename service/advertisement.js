const db = require('./db');
const helper = require('../helper');

async function createAds(title, content, imageLink, startDate, endDate, donorId, target_url) {
    try {
        const sql = `INSERT INTO tbl_advertisement( title, content, imageLink, startDate, endDate, donorId,target_url) 
    value(?,?,?,?,?,?,?)`;
        const params = [
            `${title}`,
            `${content}`,
            `${imageLink}`,
            `${startDate}`,
            `${endDate}`,
            `${donorId}`,
            `${target_url}`
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

async function updateAdvertise(id, title, content, imageLink, startDate, endDate, target_url) {
    try {
        const sql = `UPDATE tbl_advertisement set 
                    title = ? ,
                    content = ?,
                    imageLink = ?,
                    startDate = ?,
                    endDate = ?,
                    target_url = ?
                    where id = ?`;
        const params = [
            `${title}`,
            `${content}`,
            `${imageLink}`,
            `${startDate}`,
            `${endDate}`,
            `${target_url}`,
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

        const sql = `SELECT a.id, a.title, a.content, a.imageLink, a.startDate, a.endDate, a.donorId, a.target_url ass.status  as statusName
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

        const sql = `SELECT a.id, a.title, a.content, a.imageLink, a.startDate, a.endDate, a.donorId, a.target_url ass.status  as statusName
        from tbl_advertisement a , tbl_ads_status ass
        where a.statusId = ass.id and a.statusId != 5`;
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
    getAllAdvertiseByAdmin
}