const db = require('./db');
const helper = require('../helper');

async function saveRelationBetweenAccountAndSubject(subjectId, requester, author, requestId) {
    try {
        let current = new Date();
        let cDate = current.getFullYear() + '-' + (current.getMonth() + 1) + '-' + current.getDate();
        let cTime = current.getHours() + ":" + current.getMinutes() + ":" + current.getSeconds();
        let dateTime = cDate + ' ' + cTime;

        const sql = `insert into tbl_subject_relation_account(subjectId, accountId, approvedAt, subjectAuthor, subjectRequestId)
         values(?,?,?,?,?)`
        const params = [
            `${subjectId}`,
            `${requester}`,
            `${dateTime}`,
            `${author}`,
            `${requestId}`
        ]
        const result = await db.query(sql, params)
        if (result.affectedRows) {
            return result.insertId
        } else {
            return -1
        }
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    saveRelationBetweenAccountAndSubject
}