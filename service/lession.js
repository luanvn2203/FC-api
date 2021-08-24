const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getAllLession() {
    try {
        const sql = `SELECT lessionId, lessionName, accountId, subjectId, lessionDescription, createdDate, statusId from tbl_lession`;
        const rows = await db.query(sql);
        const data = helper.emptyOrRows(rows);
        return data;
    } catch (error) {
        console.log(error.message)
        return null;
    }
}

async function getLessionByLessionId(lessionId) {
    try {
        const sql = 'select lessionId, lessionName, accountId, subjectId, lessionDescription, createdDate, statusId, numOfView from tbl_lession where lessionId = ? and statusId != 3';
        const params = [`${lessionId}`]
        const rows = await db.query(sql, params);
        const result = helper.emptyOrRows(rows);
        return result;
    } catch (error) {
        console.log(error);
    }
}

async function getLessionByAcountId(accountId) {
    try {
        const sql = 'select lessionId, lessionName, accountId, subjectId, lessionDescription, createdDate, statusId from tbl_lession where accountId = ?';
        const params = [`${accountId}`]
        const rows = await db.query(sql, params);
        const result = helper.emptyOrRows(rows);
        console.log(result);
        return result;
    } catch (error) {
        console.log(error);
    }
}

async function getLessionByMe(email) {
    try {
        const sql = `SELECT lessionId, 
        lessionName, accountId, subjectId, lessionDescription,
         createdDate, statusId from tbl_lession where accountId = ? and statusId != 3 order by createdDate desc`;
        const params = [
            `${email}`
        ]
        const result = await db.query(sql, params);
        const data = helper.emptyOrRows(result)
        return data

    } catch (error) {
        console.log(error)
    }
}



async function getLessionBySubjectId(subjectId) {
    try {
        const sql = `select l.lessionId, 
        l.lessionName, 
        l.lessionDescription, 
        l.statusId,
        a.fullName as author,
        l.createdDate from tbl_lession l, tbl_account a 
        where l.accountId = a.email and l.subjectId = ? and l.statusId != 3  order by l.createdDate desc`;
        const params = [`${subjectId}`]
        const rows = await db.query(sql, params);
        const result = helper.emptyOrRows(rows);
        return result;
    } catch (error) {
        console.log(error)
    }
}

async function getLessionBySubjectIdByPublicStatus(subjectId) {
    try {
        const sql = `select l.lessionId, 
        l.lessionName, 
        l.lessionDescription, 
        l.statusId,
        a.fullName as author,
        l.createdDate from tbl_lession l, tbl_account a 
        where l.accountId = a.email and l.subjectId = ? and l.statusId = 1 order by l.createdDate desc`;
        const params = [`${subjectId}`]
        const rows = await db.query(sql, params);
        const result = helper.emptyOrRows(rows);
        console.log(result);
        return result;
    } catch (error) {
        console.log(error)
    }
}

async function createNewLessionBySubjectId(lessionParams, student) {
    try {
        const sql = `Insert into 
        tbl_lession(lessionName, accountId, subjectId, lessionDescription, createdDate, statusId) 
        values(?,?,?,?,?,?)`;
        const lession = lessionParams.params;

        let current = new Date();
        let cDate = current.getFullYear() + '-' + (current.getMonth() + 1) + '-' + current.getDate();
        let cTime = current.getHours() + ":" + current.getMinutes() + ":" + current.getSeconds();
        let dateTime = cDate + ' ' + cTime;

        const params = [
            `${lession.lessionName.trim()}`,
            `${student}`,
            `${lession.subjectId}`,
            `${lession.lessionDescription.trim()}`,
            `${dateTime}`,
            `${lession.statusId}`,
        ]
        const result = await db.query(sql, params);
        if (result.affectedRows) {
            return true;
        } else {
            return false;
        }

    } catch (error) {
        console.log(error)
    }
}

async function findLessionByNameAndSubjectId(lessionParams) {
    const lession = lessionParams.params
    const sql = `SELECT lessionId,
     lessionName, 
     accountId,
      subjectId, 
      lessionDescription, 
      createdDate, 
      statusId FROM tbl_lession where lessionName = ? and subjectId = ?`;

    const params = [
        `${lession.lessionName}`,
        `${lession.subjectId}`
    ]
    const rows = await db.query(sql, params);
    const data = helper.emptyOrRows(rows);
    return data;
}

async function UpdateLessionByID(lessionParams) {
    const lession = lessionParams.params;
    try {
        const sql = `UPDATE tbl_lession 
      set 
      lessionName = ?,
      lessionDescription = ?,
      statusId = ?
      where lessionId = ?`;
        const params = [
            `${lession.lessionName}`,
            `${lession.lessionDescription}`,
            `${lession.statusId}`,
            `${lession.lessionId}`,
        ]

        const result = await db.query(sql, params)
        if (result.affectedRows) {
            return true
        } else {
            return false
        }
    } catch (error) {
        console.log(error)
        return {
            error: error.message
        }
    }
}

async function updateLessionStatus(lessionId, status, userEmail) {
    try {
        const sql = `UPDATE tbl_lession set statusId = ? where lessionId = ? and accountId = ?`;
        const params = [
            `${status}`,
            `${lessionId}`,
            `${userEmail}`
        ]
        const result = await db.query(sql, params);
        if (result.affectedRows) {
            return true
        } else {
            return false;
        }

    } catch (error) {
        console.log(error)
    }
}
// async function findFlashcardByFullTextFlashcard(searchValue) {
//     try {
//         const sql = `select flashcardId,
//              flashcardName,
//               statusId,
//                dateOfCreate,
//                 accountId,
//                  lessionId,
//                   flashcardContent
//                    from tbl_flashcards where MATCH (flashcardName,flashcardContent) 
//         AGAINST ('test' WITH QUERY EXPANSION) and statusId != 3`;
//         const params = [
//             `${searchValue}`
//         ];
//         const result = await db.query(sql, params)
//         const data = helper.emptyOrRows(result)
//         return data;
//     } catch (error) {
//         console.log(error)
//     }
// }
async function increaseViewByClickByLessionId(lessionId) {
    try {
        const sql = `update tbl_lession set numOfview = (numOfview + 1) where lessionId = ?`;
        const params = [
            `${lessionId}`
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

async function countTotalLessionInASubject(subjectId) {
    try {
        const sql = `select count(lessionId) as total from tbl_lession where subjectId  = ? and statusId != 3`
        const params = [
            `${subjectId}`
        ]
        const result = await db.query(sql, params)
        const data = helper.emptyOrRows(result)
        return data
    } catch (error) {
        console.log(error)
    }
}

async function countTotalPublicLessionInASubject(subjectId) {
    try {
        const sql = `select count(lessionId) as total from tbl_lession where subjectId  = ? and statusId = 1`
        const params = [
            `${subjectId}`
        ]
        const result = await db.query(sql, params)
        const data = helper.emptyOrRows(result)
        return data
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    getAllLession,
    getLessionByLessionId,
    getLessionByAcountId,
    getLessionBySubjectId,
    createNewLessionBySubjectId,
    findLessionByNameAndSubjectId,
    UpdateLessionByID,
    getLessionByMe,
    updateLessionStatus,
    getLessionBySubjectIdByPublicStatus,
    increaseViewByClickByLessionId,
    // findByFullTextFlashcard,
    countTotalLessionInASubject,
    countTotalPublicLessionInASubject
}