const db = require('./db');
const helper = require('../helper');

async function addRecordToQuizTestLessionByQuizTestIdAndLessionArray(lessionArrParams, quiztestId) {
    try {
        const sql = `INSERT INTO tbl_quiztest_lession(lessionId,quiztestId) values(?,?)`;
        lessionArr = lessionArrParams.params.lessionArr;

        if (lessionArr.length > 0) {

            for (let i = 0; i < lessionArr.length; i++) {
                const params = [
                    `${lessionArr[i]}`,
                    `${quiztestId}`
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


module.exports = {
    addRecordToQuizTestLessionByQuizTestIdAndLessionArray
}