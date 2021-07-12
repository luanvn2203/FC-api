const db = require('./db');
const helper = require('../helper');

async function saveQuizHistory(account, quizTestId, numOfQuestion) {
    try {
        let current = new Date();
        let cDate = current.getFullYear() + '-' + (current.getMonth() + 1) + '-' + current.getDate();
        let cTime = current.getHours() + ":" + current.getMinutes() + ":" + current.getSeconds();
        let dateTime = cDate + ' ' + cTime;

        const sql = `INSERT into tbl_quiz_history(accountID, quiztestId, numOfQuestion, takeQuizAt)
         values(?,?,?,?)`
        const params = [
            `${account}`,
            `${quizTestId}`,
            `${numOfQuestion}`,
            `${dateTime}`
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
    saveQuizHistory
}