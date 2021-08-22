const db = require('./db');
const helper = require('../helper');

async function savePublicRelationship(accountId, subjectId, learningStatus) {
    try {
        let current = new Date();
        let cDate = current.getFullYear() + '-' + (current.getMonth() + 1) + '-' + current.getDate();
        let cTime = current.getHours() + ":" + current.getMinutes() + ":" + current.getSeconds();
        let dateTime = cDate + ' ' + cTime;
        const sql = `Insert into tbl_subject_public_relationship( accountId, subjectId, joinDate, learningStatus) 
        values(?,?,?,?)`
        const params = [
            `${accountId}`,
            `${subjectId}`,
            `${dateTime}`,
            `${learningStatus}`
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

async function getRelationByAccountIdAndSubjectId(accountId, subjectId) {
    try {
        console.log(accountId)
        console.log(subjectId)

        const sql = `select id, accountId, subjectId, joinDate, learningStatus from tbl_subject_public_relationship 
        where accountId = ? and subjectId  = ?`
        const params = [
            `${accountId}`,
            `${subjectId}`
        ]
        const result = await db.query(sql, params)
        const data = helper.emptyOrRows(result)
        return data
    } catch (error) {
        console.log(error)
    }
}

async function getRecentLearningPublicSubject(email) {
    try {
        const sql = `select s.subjectId,
        s.subjectName,
        s.accountId,
        s.topicId,
        s.subjectDescription,
        s.createdDate,
        s.statusId,
        s.numOfView ,
        rs.joinDate
       from tbl_subject s ,
       tbl_subject_public_relationship rs where s.subjectId = rs.subjectId and rs.accountId = ? 
       order by rs.joinDate desc`
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

async function getPublicSubjectUserHaveJoinedByEmail(email) {
    try {
        const sql = `select id, accountId, subjectId, joinDate, learningStatus from tbl_subject_public_relationship where accountId = ?`
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
    savePublicRelationship,
    getRelationByAccountIdAndSubjectId,
    getRecentLearningPublicSubject,
    getPublicSubjectUserHaveJoinedByEmail
}