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
async function getRelationByEmailAndSubjectId(email, subjectId) {


    try {
        const sql = `select id,
         subjectId,
          accountId,
           approvedAt,
            subjectAuthor,
             subjectRequestId,
             isMinusPoint
              from tbl_subject_relation_account 
        where accountId = ? and subjectId = ?`
        const params = [
            `${email}`,
            `${subjectId}`
        ]
        const result = await db.query(sql, params);
        const data = helper.emptyOrRows(result)

        return data;
    } catch (error) {
        console.log(error)
    }
}

async function setIsMinusPoint(value, account, subjectId) {
    try {
        const sql = `update tbl_subject_relation_account 
        set isMinusPoint = ? 
        where accountId = ? 
        and subjectId = ?`;

        const params = [
            value,
            `${account}`,
            `${subjectId}`
        ]
        const result = await db.query(sql, params)
        if (result.affectedRows) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.log(error)
    }
}

async function getRecentLearningPrivateSubject(email) {
    try {
        const sql = `select s.subjectId,
        s.subjectName,
        s.accountId,
        s.topicId,
        s.subjectDescription,
        s.createdDate,
        s.statusId,
        s.numOfView, 
        rs.approvedAt as joinDate
       from tbl_subject s ,
       tbl_subject_relation_account rs where s.subjectId = rs.subjectId and rs.accountId = ? 
       order by rs.approvedAt desc
       `
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
    saveRelationBetweenAccountAndSubject,
    getRelationByEmailAndSubjectId,
    setIsMinusPoint,
    getRecentLearningPrivateSubject
}