const db = require('./db');
const helper = require('../helper');

async function saveUserChoice(accountID, optionId_arr_json, historyDetailId, questionId) {
    try {


        const sql = `INSERT into tbl_user_choice(accountId, optionId, historyId, questionId) values(?,?,?,?)`
        const params = [
            `${accountID}`,
            `${optionId_arr_json}`,
            `${historyDetailId}`,
            `${questionId}`
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

async function getUserChoiceByHistoryId(historyId) {
    try {
        const sql = `select questionId, optionId from tbl_user_choice where historyId = ?`
        const params = [`${historyId}`]
        const result = await db.query(sql, params)
        const data = helper.emptyOrRows(result)
        return data;
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    saveUserChoice,
    getUserChoiceByHistoryId
}