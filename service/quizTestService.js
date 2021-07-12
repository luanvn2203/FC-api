const db = require('./db');
const helper = require('../helper');

async function createQuizTest(quizTestParams, user, isFinalQuiz) {
    try {
        let current = new Date();
        let cDate = current.getFullYear() + '-' + (current.getMonth() + 1) + '-' + current.getDate();
        let cTime = current.getHours() + ":" + current.getMinutes() + ":" + current.getSeconds();
        let dateTime = cDate + ' ' + cTime;

        const quizTest = quizTestParams.params;
        const sql = 'INSERT INTO tbl_quiztest(testName, createdDate, isFinalQuiz, accountId, subjectId, lessionId_arr) values(?, ?, ?, ?,?,?) ';
        const params = [
            `${quizTest.testName}`,
            `${dateTime}`,
            isFinalQuiz,
            `${user}`,
            quizTest.subjectId,
            `${JSON.stringify(quizTest.lessionArr)}`
        ]
        const result = await db.query(sql, params);
        if (result.affectedRows) {
            return result.insertId
        } else {
            return -1
        }
    } catch (error) {
        console.log(error)
    }
}

async function getCurrentInsertId(quizTestParams, user) {
    try {
        const testName = quizTestParams.params.testName
        const sql = `select max(id) as id
        from tbl_quiztest 
        where testName = ? and
        accountId = ?`
        const params = [
            `${testName}`,
            `${user}`
        ]
        const result = await db.query(sql, params);
        const data = helper.emptyOrRows(result);
        return data;

    } catch (error) {
        console.log(error)
    }
}

async function checkDuplicateName(quizTestParams) {
    try {
        const quizTestName = quizTestParams.params.testName;
        const sql = `SELECT id,testName from tbl_quiztest where testName = ?`;
        const params = [
            `${quizTestName}`
        ]
        const result = await db.query(sql, params)
        const data = helper.emptyOrRows(result);
        return data;

    } catch (error) {
        console.log(error)
    }
}

async function getQuizTestsBySubjectId(subjectId) {
    try {
        const sql = `SELECT id,
        testName,
        createdDate,
        isFinalQuiz,
        subjectId,
        lessionId_arr
        from tbl_quiztest 
        where subjectId = ? order by createdDate desc`;
        const params = [
            `${subjectId}`
        ]
        const result = await db.query(sql, params);
        const data = helper.emptyOrRows(result);
        return data
    } catch (error) {
        console.log(error)
    }
}

async function getQuizTestInfomationById(quiztestId) {
    try {
        const sql = `SELECT id, testName, createdDate, isFinalQuiz, accountId, subjectId, lessionId_arr 
        from tbl_quiztest where id = ?`;
        const params = [
            `${quiztestId}`
        ]
        const result = await db.query(sql, params);
        const data = helper.emptyOrRows(result)
        return data
    } catch (error) {
        console.log(error)
    }
}



module.exports = {
    createQuizTest,
    getCurrentInsertId,
    checkDuplicateName,
    getQuizTestsBySubjectId,
    getQuizTestInfomationById
}