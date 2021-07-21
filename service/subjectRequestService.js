const db = require('./db');
const helper = require('../helper');

async function saveRequest(requestFrom, requestTo, subjectId, statusId) {
    try {
        let current = new Date();
        let cDate = current.getFullYear() + '-' + (current.getMonth() + 1) + '-' + current.getDate();
        let cTime = current.getHours() + ":" + current.getMinutes() + ":" + current.getSeconds();
        let dateTime = cDate + ' ' + cTime;

        const sql = `insert into tbl_subject_request(requestFrom, requestTo, subjectId, statusId, requestedAt) 
        values(?,?,?,?,?)`

        const params = [
            `${requestFrom.trim()}`,
            `${requestTo.trim()}`,
            `${subjectId}`,
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
        const sql = ` select sq.id, sq.requestFrom, sq.requestTo,
         sq.subjectId, sq.statusId, rs.statusName as statusName, sq.requestedAt , s.subjectName as name
        from tbl_subject_request sq, tbl_request_status rs, tbl_subject s 
        where sq.statusId = rs.id and sq.subjectId = s.subjectId
        and requestTo = ? order by sq.requestedAt desc`
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
        const sql = `select id, requestFrom, requestTo, subjectId, statusId, requestedAt 
        from tbl_subject_request where id = ?  `;
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
        const sql = `update tbl_subject_request set statusId = ? where id = ?`;
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

async function checkDuplicateRequest(subjectId, from, to) {
    try {
        const sql = `SELECT id FROM tbl_subject_request 
      where subjectId = ?  
      and requestFrom = ? 
      and requestTo = ?`;
        const params = [
            `${subjectId}`,
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


module.exports = {
    saveRequest,
    getAllRequestSendToMeByEmail,
    getRequestDetailById,
    checkDuplicateRequest,

    updateRequestStatus

}