const db = require('./db');
const helper = require('../helper');

async function saveFeedBack(donorServiceRelationAccountId, accountId, point, content) {
    try {
        let current = new Date();
        let cDate = current.getFullYear() + '-' + (current.getMonth() + 1) + '-' + current.getDate();
        let cTime = current.getHours() + ":" + current.getMinutes() + ":" + current.getSeconds();
        let dateTime = cDate + ' ' + cTime;
        const sql = `INSERT INTO tbl_service_feedback(donorServiceRelationAccountId, accountId, point, content,dateOfFeedback) 
                    values(?,?,?,?,?)`
        const params = [
            `${donorServiceRelationAccountId}`,
            `${accountId}`,
            `${point}`,
            `${content}`,
            `${dateTime}`
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

async function findFeedbackByAccountIdAndServiceRelationAccountId(accountId, relationId) {
    try {
        const sql = `Select id, donorServiceRelationAccountId, accountId, point, content, dateOfFeedback 
        from tbl_service_feedback where accountId = ? and donorServiceRelationAccountId = ?`
        const params = [
            `${accountId}`,
            `${relationId}`
        ]
        const result = await db.query(sql, params)
        const data = helper.emptyOrRows(result)
        return data
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    saveFeedBack,
    findFeedbackByAccountIdAndServiceRelationAccountId
}