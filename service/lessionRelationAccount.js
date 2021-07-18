const db = require('./db');
const helper = require('../helper');

async function saveRelationBetweenAccountAndLession(lessionId, requester, author, requestId) {
    try {
        let current = new Date();
        let cDate = current.getFullYear() + '-' + (current.getMonth() + 1) + '-' + current.getDate();
        let cTime = current.getHours() + ":" + current.getMinutes() + ":" + current.getSeconds();
        let dateTime = cDate + ' ' + cTime;

        const sql = `insert into tbl_lession_relation_account(lessionId, accountId, approvedAt, lessionAuthor, lessionRequestId)
         values(?,?,?,?,?)`
        const params = [
            `${lessionId}`,
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
async function getRelationByEmailAndLessionId(email, lessionId) {


    try {
        const sql = `select id,
         lessionId,
          accountId,
           approvedAt,
            lessionAuthor,
             lessionRequestId,
              isMinusPoint
              from tbl_lession_relation_account 
        where accountId = ? and lessionId = ?`
        const params = [
            `${email}`,
            `${lessionId}`
        ]
        const result = await db.query(sql, params);
        const data = helper.emptyOrRows(result)
        return data;
    } catch (error) {
        console.log(error)
    }
}

async function setIsMinusPoint(value, account, lessionId) {
    try {
        const sql = `update tbl_lession_relation_account 
        set isMinusPoint = ? 
        where accountId = ? 
        and lessionId = ?`;

        const params = [
            value,
            `${account}`,
            `${lessionId}`
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
module.exports = {
    saveRelationBetweenAccountAndLession,
    getRelationByEmailAndLessionId,
    setIsMinusPoint
}