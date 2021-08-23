const db = require('./db');
const helper = require('../helper');

async function saveRelationShip(accountId, lessionId, subjectId) {
    try {
        let current = new Date();
        let cDate = current.getFullYear() + '-' + (current.getMonth() + 1) + '-' + current.getDate();
        let cTime = current.getHours() + ":" + current.getMinutes() + ":" + current.getSeconds();
        let dateTime = cDate + ' ' + cTime;
        const sql = 'INSERT INTO tbl_lession_public_relationship(lessionId, accountId, joinDate,subjectId) values(?,?,?,?)'
        const params = [
            `${lessionId}`,
            `${accountId}`,
            `${dateTime}`,
            `${subjectId}`
        ]
        const result = await db.query(sql, params);
        if (result.affectedRows) {
            return true
        } else {
            return false
        }

    } catch (error) {
        console.log(error)
    }
}

async function getAllLessionIdBySubjectId(accountId, subjectId) {
    try {
        const sql = `select  lessionId from tbl_lession_public_relationship 
        where subjectId = ? and accountId = ? `
        const params = [
            `${subjectId}`,
            `${accountId}`
        ]
        const result = await db.query(sql, params)
        const data = helper.emptyOrRows(result)
        return data
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    saveRelationShip,
    getAllLessionIdBySubjectId
}