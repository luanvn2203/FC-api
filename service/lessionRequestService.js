const db = require('./db');
const helper = require('../helper');

async function saveRequest(requestFrom, requestTo, lessionId, statusId) {
    try {
        let current = new Date();
        let cDate = current.getFullYear() + '-' + (current.getMonth() + 1) + '-' + current.getDate();
        let cTime = current.getHours() + ":" + current.getMinutes() + ":" + current.getSeconds();
        let dateTime = cDate + ' ' + cTime;

        const sql = `insert into tbl_lession_request(requestFrom, requestTo, lessionId, statusId, requestedAt) 
        values(?,?,?,?,?)`

        const params = [
            `${requestFrom.trim()}`,
            `${requestTo.trim()}`,
            `${lessionId}`,
            `${statusId}`,
            `${dateTime}`
        ]
        const result = await db.query(sql, params);
        if (result.affectedRows) {
            return result.insertId
        } else {
            return -1
        }


    } catch (error) {
        console.log(error)
    }
}

async function getAllRequestSendToMeByEmail(email) {
    try {
        const sql = `select le.id,
        le.requestFrom,
        le.requestTo,
        le.lessionId,
        le.statusId,
        rs.statusName as statusName,
        le.requestedAt,
        l.lessionName as name
        from tbl_lession_request le,
        tbl_request_status rs,
        tbl_lession l 
        where le.statusId = rs.id 
        and le.lessionId = l.lessionId
        and requestTo = ? order by le.requestedAt desc `
        const params = [
            `${email}`
        ]
        const result = await db.query(sql, params)
        const data = helper.emptyOrRows(result)
        return data;
    } catch (error) {
        console.log(error)
    }
}

async function getRequestDetailById(requestId) {
    try {
        const sql = `select id, requestFrom, requestTo, lessionId, statusId, requestedAt 
        from tbl_lession_request where id = ?  `;
        const params = [
            `${requestId}`
        ]
        const result = await db.query(sql, params);
        const data = helper.emptyOrRows(result)
        return data

    } catch (error) {
        console.log(error)
    }
}

async function updateRequestStatus(requestId, status) {
    try {
        const sql = `update tbl_lession_request set statusId = ? where id = ?`;
        const params = [
            `${status}`,
            `${requestId}`
        ]
        const result = await db.query(sql, params)
        if (result.affectedRows) {
            return true
        } else {
            return false;
        }


    } catch (error) {
        console.log(error)
    }
}

async function checkDuplicateRequest(lessionId, from, to) {
    try {
        const sql = `SELECT id FROM tbl_lession_request 
        where lessionId = ?  
        and requestFrom = ? 
        and requestTo = ?`;
        const params = [
            `${lessionId}`,
            `${from.trim()}`,
            `${to.trim()}`
        ]
        const result = await db.query(sql, params);
        const data = helper.emptyOrRows(result);
        return data

    } catch (error) {
        console.log(error)
    }
}

async function getAllRequestByEmail(email) {
    try {
        const sql = `select lr.id, lr.requestFrom, lr.requestTo, lr.lessionId,l.lessionName, lr.statusId, lr.requestedAt from tbl_lession_request lr, tbl_lession l
        where lr.lessionId = l.lessionId and  lr.requestFrom = ?`
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

module.exports = {
    saveRequest,
    getAllRequestSendToMeByEmail,
    getRequestDetailById,
    checkDuplicateRequest,

    updateRequestStatus,

    getAllRequestByEmail
}