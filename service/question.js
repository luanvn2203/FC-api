const db = require('./db');
const helper = require('../helper');

async function addNewQuestionToFlashCard(questionParams) {
    console.log(questionParams)
    try {
        const sql = `INSERT INTO 
        tbl_question(questionContent, createdDate, flashcardId, statusId)
        VALUES(?,?,?,?)`;

        let current = new Date();
        let cDate = current.getFullYear() + '-' + (current.getMonth() + 1) + '-' + current.getDate();
        let cTime = current.getHours() + ":" + current.getMinutes() + ":" + current.getSeconds();
        let dateTime = cDate + ' ' + cTime;

        const params = [
            `${questionParams.questionContent.trim()}`,
            `${dateTime}`,
            `${questionParams.flashcardId}`,
            1,
        ]

        const result = await db.query(sql, params);

        if (result.affectedRows) {
            console.log(result)
            // const lastetestId = await getLatestInsertQuestionID();
            // question.questionId = lastetestId
            return result.insertId
        } else {
            console.log("bang tru 1")
            return -1
        }

    } catch (error) {
        console.log(error)
    }
}

async function getLatestInsertQuestionID(flashcardID) {
    try {
        const sql = `SELECT max(questionId) as id from tbl_question where flashcardId = ? `;
        const params = [`${flashcardID}`]
        const latestId = await db.query(sql, params);
        console.log(latestId[0].id)
        if (latestId[0].id > 0) {
            return latestId[0].id
        } else {
            return -1;
        }

    } catch (error) {
        console.log(error)
    }
}

async function getTotalQuestionByFlashcardId(flashcardId) {
    try {
        const sql = 'select count(questionId) as totalQuestion from tbl_question where flashcardId = ?';
        const params = [`${flashcardId}`]
        const rows = await db.query(sql, params);
        const result = helper.emptyOrRows(rows);
        //console.log(result);
        return result;
    } catch (error) {
        console.log(error);
    }
}

async function getQuestionsByFlashcardId(flashcardIdParam) {
    console.log(flashcardIdParam)
    try {
        const fcid = flashcardIdParam;
        const sql = `SELECT questionId,
        questionContent,
        createdDate,
        flashcardId,
        statusId 
        from tbl_question where flashcardId = ? and statusId != 3 order by createdDate desc`
        const params = [
            `${fcid}`
        ]
        const result = await db.query(sql, params);
        const data = helper.emptyOrRows(result)
        return data
    } catch (error) {
        console.log(error)
    }
}

async function updateQuestionStatus(questionIdParams, status) {
    try {
        const deleteParams = questionIdParams.params;
        const sql = "UPDATE tbl_question set statusId = ? where questionId = ? ";
        const params = [
            `${status}`,
            `${deleteParams.questionId}`,
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

async function updateQuestionOption(question) {
    try {
        const sql = `UPDATE tbl_question 
        set questionContent = ?
         where questionId = ?`;
        const params = [
            `${question.questionContent.trim()}`,
            `${question.questionId}`
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

async function getQuestionsByFlashcardIdAndFilteredInfor(flashcardIdParam) {
    try {
        const fcid = flashcardIdParam;
        const sql = `SELECT questionId,
        questionContent
        from tbl_question where flashcardId = ? and statusId != 3 order by createdDate desc`
        const params = [
            `${fcid}`
        ]
        const result = await db.query(sql, params);
        const data = helper.emptyOrRows(result)
        return data
    } catch (error) {
        console.log(error)
    }
}
async function findFlashCardByQuestionByFullTextSearch(searchValue) {
    try {
        const sql = ` select flashcardId, flashcardName,
        statusId, dateOfCreate, accountId,
        lessionId, flashcardContent from tbl_flashcards where flashcardId 
        in (select distinct flashcardId from tbl_question where 
        MATCH (questionContent) AGAINST (? WITH QUERY EXPANSION) and statusId != 3)`;
        const params = [
            `${searchValue}`
        ];
        const result = await db.query(sql, params)
        const data = helper.emptyOrRows(result)
        return data;
    } catch (error) {
        console.log(error)
    }
}

async function get3QuestionByFlashcardIdWithinFullTextSearch(searchValue, flashcardId) {
    try {
        const sql = `select questionId, questionContent, createdDate, flashcardId,
         statusId from tbl_question where flashcardId = ? and
        MATCH (questionContent) AGAINST (? ) and statusId != 3 limit 3`;
        const params = [
            `${flashcardId}`,
            `${searchValue}`
        ];
        const result = await db.query(sql, params)
        const data = helper.emptyOrRows(result)
        return data;
    } catch (error) {
        console.log(error)
    }
}


module.exports = {
    addNewQuestionToFlashCard,
    getLatestInsertQuestionID,
    getTotalQuestionByFlashcardId,
    getQuestionsByFlashcardId,
    updateQuestionStatus,
    updateQuestionOption,
    getQuestionsByFlashcardIdAndFilteredInfor,
    findFlashCardByQuestionByFullTextSearch,
    get3QuestionByFlashcardIdWithinFullTextSearch,
}
