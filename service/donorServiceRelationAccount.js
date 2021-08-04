const db = require('./db');
const helper = require('../helper');

async function saveServiceRelationToAccount(accountId, serviceDetailId) {
    try {
        let current = new Date();
        let cDate = current.getFullYear() + '-' + (current.getMonth() + 1) + '-' + current.getDate();
        let cTime = current.getHours() + ":" + current.getMinutes() + ":" + current.getSeconds();
        let dateTime = cDate + ' ' + cTime;
        const sql = `INSERT INTO tbl_donorservice_relation_account(accountId, serviceDetailId, dateOfReceived) 
        values(?,?,?)`;
        const params = [
            `${accountId}`,
            `${serviceDetailId}`,
            `${dateTime}`,
        ]
        const result = await db.query(sql, params)
        if (result.affectedRows) {
            return true;
        } else {
            return false
        }

    } catch (error) {
        console.log(error)
    }
}

async function viewHistoryReceiveService(email) {
    try {
        const sql = `Select id, accountId, serviceDetailId, dateOfReceived from tbl_donorservice_relation_account where accountId = ? `;
        const params = [
            `${email}`
        ]
        const result = await db.query(sql, params);
        const data = helper.emptyOrRows(result)
        return data
    } catch (error) {
        console.log(error)
    }
}

async function getRelationByid(id) {
    try {
        const sql = `Select id, accountId, serviceDetailId, dateOfReceived from tbl_donorservice_relation_account where id = ? `;
        const params = [
            `${id}`
        ]
        const result = await db.query(sql, params);
        const data = helper.emptyOrRows(result)
        return data
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    saveServiceRelationToAccount,
    viewHistoryReceiveService,
    getRelationByid
}