const db = require('./db');
const helper = require('../helper');

async function saveQuizHistory(account, quizTestId, numOfQuestion, numOfCorrect, totalCore) {
    try {
        let current = new Date();
        let cDate = current.getFullYear() + '-' + (current.getMonth() + 1) + '-' + current.getDate();
        let cTime = current.getHours() + ":" + current.getMinutes() + ":" + current.getSeconds();
        let dateTime = cDate + ' ' + cTime;

        const sql = `INSERT into tbl_quiz_history(accountID, quiztestId, numOfQuestion, takeQuizAt, numOfCorrect, totalCore)
         values(?,?,?,?,?,?)`
        const params = [
            `${account}`,
            `${quizTestId}`,
            `${numOfQuestion}`,
            `${dateTime}`,
            `${numOfCorrect}`,
            `${totalCore}`
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

async function getQuizHistoryById(historyId) {
    try {
        const sql = `select h.id historyId, 
        h.accountID, 
        h.quiztestId, 
        h.numOfQuestion, 
        h.takeQuizAt, 
        h.numOfCorrect, 
        h.totalCore, 
        t.id as testId ,
        t.testName
        from tbl_quiz_history h , tbl_quiztest t 
        where h.quiztestId = t.id and h.id = ?`
        const params = [
            `${historyId}`
        ]
        const result = await db.query(sql, params)
        const data = helper.emptyOrRows(result)
        return data

    } catch (error) {
        console.log(error)
    }
}

async function getAllQuizHistoryByAccountId(email) {
    try {
        const sql = `select qh.id as historyId, 
        qh.accountID, 
        qh.quiztestId, 
        qh.numOfQuestion, 
        qh.takeQuizAt, 
        qh.numOfCorrect, 
        qh.totalCore,
        qt.testName,
        (select subjectName from tbl_subject where subjectId = qt.subjectId) as subjectName
        from tbl_quiz_history qh, tbl_quiztest qt
        where qh.quiztestId = qt.id and qh.accountID = ?`;
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

async function getNumOfTakeQuizTime(accountId, quizTestId) {
    try {
        const sql = `select count(id) as timeOfTakeQuiz from tbl_quiz_history
        where accountID = ? and quiztestId = ?`
        const params = [
            `${accountId}`,
            `${quizTestId}`
        ]
        const result = await db.query(sql, params);
        const data = helper.emptyOrRows(result)
        return data

    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    saveQuizHistory,
    getQuizHistoryById,
    getAllQuizHistoryByAccountId,
    getNumOfTakeQuizTime
}