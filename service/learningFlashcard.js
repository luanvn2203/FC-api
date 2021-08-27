
const db = require('./db');
const helper = require('../helper');

async function saveLearningFLashcardByEmailAndFlashcardId(email, flashcardId, lessionId, subjectId) {
    try {
        console.log(email, flashcardId)
        let current = new Date();
        let cDate = current.getFullYear() + '-' + (current.getMonth() + 1) + '-' + current.getDate();
        let cTime = current.getHours() + ":" + current.getMinutes() + ":" + current.getSeconds();
        let dateTime = cDate + ' ' + cTime;

        const sql = `INSERT INTO tbl_learning_flashcard(accountId, flashcardId, learningDate, lessionId,subjectId) 
        values(?,?,?,?,?)`
        const params = [
            `${email}`,
            `${flashcardId}`,
            `${dateTime}`,
            `${lessionId}`,
            `${subjectId}`
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

async function getRecentLearningByEmailAndFlashcardID(accountId, flashcardId) {
    try {
        const sql = `select id, accountId, flashcardId, learningDate, duration from tbl_learning_flashcard
        where accountId = ? and flashcardId = ?`
        const params = [
            `${accountId}`,
            `${flashcardId}`
        ]
        const result = await db.query(sql, params)
        const data = helper.emptyOrRows(result)
        return data
    } catch (error) {
        console.log(error)
    }
}

async function getAllRelationByLessionId(accountId, lessionId) {
    try {
        const sql = `select id, accountId, flashcardId, learningDate, duration, lessionId from tbl_learning_flashcard 
        where lessionId = ? and accountId = ?`
        const params = [
            `${lessionId}`,
            `${accountId}`
        ]
        const result = await db.query(sql, params)
        const data = helper.emptyOrRows(result)
        return data;
    } catch (error) {
        console.log(error)
    }
}

async function countCompleteFlashcardBySubjectId(accountId, subjectId) {
    try {
        const sql = ` select count(flashcardId) as completeFlashcard from tbl_learning_flashcard 
        where accountId = ?
        and subjectId = ? `

        const params = [
            `${accountId}`,
            `${subjectId}`
        ]
        const result = await db.query(sql, params)
        const data = helper.emptyOrRows(result);
        return data
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    saveLearningFLashcardByEmailAndFlashcardId,
    getRecentLearningByEmailAndFlashcardID,

    getAllRelationByLessionId,

    countCompleteFlashcardBySubjectId
}