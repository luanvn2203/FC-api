const db = require('./db');
const helper = require('../helper');

async function addRecordToQuizTestQuestionByQuizTestIdAndQuestionArray(questionArray, quiztestId) {
    try {
        const sql = `INSERT INTO tbl_quiztest_question(questionId,quiztestId) values(?,?)`;
        if (questionArray.length > 0) {
            for (let i = 0; i < questionArray.length; i++) {
                const params = [
                    questionArray[i],
                    quiztestId
                ]
                const result = await db.query(sql, params);
                if (result.affectedRows) {
                    console.log("OK at: " + (i + 1))
                }

            }
            return true;
        }
    } catch (error) {
        console.log(error)
    }
}

async function getQuestionsByQuizTestId(quiztestId) {
    try {
        const deleteStatus = 3;
        const sql = `select questionId, questionContent, createdDate, flashcardId, statusId from tbl_question
        where questionId in (select questionId from tbl_quiztest_question where quiztestId = ? ) and statusId != ?`
        const params = [
            `${quiztestId}`,
            `${deleteStatus}`
        ]
        const result = await db.query(sql, params);
        const data = helper.emptyOrRows(result)
        return data
    } catch (error) {
        console.log(error)
    }
}
async function getQuestionsForForUserQuizByQuizTestId(quiztestId) {
    try {
        const deleteStatus = 3;
        const sql = `select questionId, questionContent, createdDate, flashcardId, statusId from tbl_question
        where questionId in (select questionId from tbl_quiztest_question where quiztestId = ? ) and statusId != ? ORDER BY RAND()`
        const params = [
            `${quiztestId}`,
            `${deleteStatus}`
        ]
        const result = await db.query(sql, params);
        const data = helper.emptyOrRows(result)
        return data
    } catch (error) {
        console.log(error)
    }
}
async function getTotalQuestionInTest(testId) {
    try {
        const sql = `SELECT count(questionId) as total   
        FROM  tbl_quiztest_question 
        where quiztestId = ?`
        const params = [
            `${testId}`
        ]
        const result = await db.query(sql, params);
        const data = helper.emptyOrRows(result)
        return data;

    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    addRecordToQuizTestQuestionByQuizTestIdAndQuestionArray,
    getQuestionsByQuizTestId,
    getTotalQuestionInTest,
    getQuestionsForForUserQuizByQuizTestId
}