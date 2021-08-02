const db = require('./db');
const helper = require('../helper');

async function addOptionForAnswer(listOption, questionId) {
    try {
        const options = listOption;

        let current = new Date();
        let cDate = current.getFullYear() + '-' + (current.getMonth() + 1) + '-' + current.getDate();
        let cTime = current.getHours() + ":" + current.getMinutes() + ":" + current.getSeconds();
        let dateTime = cDate + ' ' + cTime;

        const sql = `INSERT INTO tbl_optiondetail(optionContent, questionId, createdDate, statusId, isCorrect) VALUES (?,?,?,?,?)`

        for (let i = 0; i < options.length; i++) {
            const params = [
                `${options[i].optionContent.trim()}`,
                `${questionId}`,
                `${dateTime}`,
                1,
                options[i].isCorrect
            ];
            const insertResult = await db.query(sql, params)
            if (insertResult.affectedRows) {
                console.log("ok at row: " + (i + 1))
            } else {
                console.log('failed at row :' + (i + 1))
            }
        }
        return true

    } catch (error) {
        console.log(error)
    }
}

async function getOptionsByQuestionId(question) {
    try {
        const questionId = question.questionId;

        const sql = `SELECT optionId,
        optionContent, 
        questionId, 
        createdDate, 
        statusId, 
        isCorrect  
        from tbl_optiondetail where questionId = ? and statusId = 1`;
        const params = [
            `${questionId}`
        ]
        const result = await db.query(sql, params);
        const data = helper.emptyOrRows(result);
        return data

    } catch (error) {
        console.log(error)
    }
}

async function updateOptionsByQuestionId(options) {
    try {
        const sql = `UPDATE tbl_optiondetail set optionContent = ?, isCorrect = ? where optionId = ?`

        for (let i = 0; i < options.length; i++) {
            const params = [
                `${options[i].optionContent}`,
                options[i].isCorrect,
                `${options[i].optionId}`
            ]
            const result = await db.query(sql, params);
            if (result.affectedRows) {
                console.log("update ok with option: " + i)
            } else {
                console.log("update failed with option: " + i)
            }
        }
        return true;

    } catch (error) {
        console.log(error)
    }
}
async function getOptionsByQuestionIdAndFilteredInfo(question) {
    try {
        const questionId = question.questionId;
        const sql = `SELECT optionId,
        optionContent, 
        questionId, 
        isCorrect  
        from tbl_optiondetail where questionId = ? and statusId = 1`;
        const params = [
            `${questionId}`
        ]
        const result = await db.query(sql, params);
        const data = helper.emptyOrRows(result);
        return data

    } catch (error) {
        console.log(error)
    }
}
async function getOptionsByQuestionIdAndFilteredInfoWithRandomIndex(question) {
    try {
        const questionId = question.questionId;
        const sql = `SELECT optionId,
        optionContent, 
        questionId, 
        isCorrect  
        from tbl_optiondetail where questionId = ? and statusId = 1 ORDER BY RAND()`;
        const params = [
            `${questionId}`
        ]
        const result = await db.query(sql, params);
        const data = helper.emptyOrRows(result);
        return data

    } catch (error) {
        console.log(error)
    }
}

async function getTrueOptionByQuestionId(questionId) {
    try {
        const sql = `SELECT optionId from tbl_optiondetail where isCorrect = 1 and questionId  = ? and statusId = 1`
        const params = [
            `${questionId}`
        ]
        const result = await db.query(sql, params)
        for (let i = 0; i < result.length; i++) {
            result[i] = result[i].optionId
        }
        const data = helper.emptyOrRows(result)

        return data
    } catch (error) {

    }
}
async function updateOptionStatus(optionId, status) {
    try {
        const sql = 'update tbl_optiondetail set statusId = ? where optionId = ?'
        const params = [
            `${status}`,
            `${optionId}`
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

module.exports = {
    addOptionForAnswer,
    getOptionsByQuestionId,
    updateOptionsByQuestionId,
    getOptionsByQuestionIdAndFilteredInfo,
    getOptionsByQuestionIdAndFilteredInfoWithRandomIndex,
    getTrueOptionByQuestionId,
    updateOptionStatus
}

// let strArray = [ "q", "w", "w", "w", "e", "i", "u", "r"];
// let findDuplicates = arr => arr.filter((item, index) => arr.indexOf(item) != index)

// console.log(findDuplicates(strArray)) // All duplicates
// console.log([...new Set(findDuplicates(strArray))]) // Unique duplicates