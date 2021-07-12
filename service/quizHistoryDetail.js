const db = require('./db');
const helper = require('../helper');

async function saveQuizHistoryDetail(historyId, numOfCorrect, totalCore) {
    try {


        const sql = `INSERT into tbl_quiz_history_detail(historyId, numOfCorrect, totalCore) 
        values(?,?,?)`
        const params = [
            `${historyId}`,
            `${numOfCorrect}`,
            `${totalCore}`,
        ]
        const result = await db.query(sql, params)
        if (result.affectedRows) {
            return result.insertId
        } else {
            return -1;
        }

    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    saveQuizHistoryDetail
}