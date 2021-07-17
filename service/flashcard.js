const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function createFlashcard(flashcardParams, student) {
    try {
        const sql = `Insert into 
        tbl_flashcards(flashcardName, statusId, dateOfCreate, accountId, lessionId, flashcardContent) 
        values(?,?,?,?,?,?)`;
        const flashcard = flashcardParams.params;

        let current = new Date();
        let cDate = current.getFullYear() + '-' + (current.getMonth() + 1) + '-' + current.getDate();
        let cTime = current.getHours() + ":" + current.getMinutes() + ":" + current.getSeconds();
        let dateTime = cDate + ' ' + cTime;
        console.log(flashcard)
        const params = [
            `${flashcard.flashcardName.trim()}`,
            `${flashcard.statusId}`,
            `${dateTime}`,
            `${student}`,
            `${flashcard.lessionId}`,
            `${flashcard.flashcardContent.trim()}`,

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

async function findFlashcardByName(flashcardsParams) {
    const flashcard = flashcardsParams.params
    const sql = `SELECT flashcardId,
     flashcardName,  flashcardContent, statusId, dateOfCreate,
      accountId, lessionId FROM tbl_flashcards 
      where flashcardName = ? and lessionId = ?`;

    const params = [`${flashcard.flashcardName}`, `${flashcard.lessionId}`]
    const rows = await db.query(sql, params);
    const data = helper.emptyOrRows(rows);
    return data;
}

async function getAllFlashcard() {
    try {
        const sql = `SELECT flashcardId, flashcardName,  flashcardContent, statusId, dateOfCreate, accountId, lessionId from tbl_flashcards`;
        const rows = await db.query(sql);
        const data = helper.emptyOrRows(rows);
        return data;
    } catch (error) {
        console.log(error.message)
        return null;
    }
}

async function getFlashcardByFlashcardId(flashcardId) {
    try {
        const sql = 'select flashcardId, flashcardName,  flashcardContent, statusId, dateOfCreate, accountId, lessionId, numOfView from tbl_flashcards where flashcardId = ? and statusId != 3';
        const params = [`${flashcardId}`]
        const rows = await db.query(sql, params);
        const result = helper.emptyOrRows(rows);
        return result;
    } catch (error) {
        console.log(error);
    }
}

// async function getFlashcardByAcountId(accountId) {
//     try {
//         const sql = 'select flashcardId, flashcardName,  flashcardContent, statusId, dateOfCreate, accountId, lessionId from tbl_flashcards where accountId = ?';
//         const params = [`${accountId}`];
//         const result = await db.query(sql, params);
//         if (result.affectedRows) {
//             return true;
//         } else {
//             return false;
//         }

//     } catch (error) {
//         console.log(error);
//     }
// }

async function getFlashcardByMe(email) {
    try {
        const sql = `SELECT flashcardId, flashcardName ,  flashcardContent,statusId, dateOfCreate, accountId, lessionId from tbl_flashcards where accountId = ? and statusId != 3 order by dateOfCreate desc`;
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

async function getFlashcardByLessionId(lessionId) {
    try {
        const sql = `select f.flashcardId, f.flashcardName,   f.flashcardContent,
        f.statusId, f.dateOfCreate,
         f.accountId, f.lessionId, a.fullName as author 
         from tbl_flashcards f, tbl_account a 
         where f.accountId = a.email and f.lessionId = ? and f.statusId != 3 order by f.dateOfCreate desc`;
        const params = [`${lessionId}`]
        const rows = await db.query(sql, params);
        const result = helper.emptyOrRows(rows);
        console.log(result);
        return result;
    } catch (error) {
        console.log(error);
    }
}

async function getPublicFlashcardByLessionId(lessionId) {
    try {
        const sql = `select f.flashcardId, f.flashcardName,   f.flashcardContent,
        f.statusId, f.dateOfCreate,
         f.accountId, f.lessionId, a.fullName as author 
         from tbl_flashcards f, tbl_account a 
         where f.accountId = a.email and f.lessionId = ? and f.statusId = 1 order by f.dateOfCreate desc`;
        const params = [`${lessionId}`]
        const rows = await db.query(sql, params);
        const result = helper.emptyOrRows(rows);
        console.log(result);
        return result;
    } catch (error) {
        console.log(error);
    }
}

async function UpdateFlashcardByID(flashcardParams) {
    const flashcard = flashcardParams.params;
    console.log(flashcard)
    try {
        const sql = `UPDATE tbl_flashcards set flashcardName = ?, flashcardContent = ?, statusId = ? where flashcardId = ?`;
        const params = [
            `${flashcard.flashcardName}`,
            `${flashcard.flashcardContent}`,
            flashcard.statusId,
            flashcard.flashcardId,
        ]
        console.log(params)
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

async function updateFlashcardStatus(flashcardId, status, userEmail) {
    try {
        const sql = `UPDATE tbl_flashcards set statusId = ? where flashcardId = ? and accountId = ?`;
        const params = [
            `${status}`,
            `${flashcardId}`,
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

async function getFlashcardByArrayLessionId(arrayLessionId) {
    console.log(arrayLessionId)
    try {
        const sql = `select flashcardId,
         flashcardName, 
         flashcardContent,
         statusId, 
         dateOfCreate, 
         accountId, 
         lessionId 
        from tbl_flashcards where lessionId in (${arrayLessionId})`;
        const result = await db.query(sql);
        console.log(result);
        const data = helper.emptyOrRows(result)
        return data;
    } catch (error) {
        console.log(error)
    }
}

async function getFlashcardByArrayLessionIdAndFilteredInfo(arrayLessionId) {
    console.log(arrayLessionId)
    try {
        const sql = `select flashcardId,
         flashcardName, 
         flashcardContent,
         lessionId 
        from tbl_flashcards where lessionId in (${arrayLessionId})`;
        const result = await db.query(sql);
        const data = helper.emptyOrRows(result)
        return data;
    } catch (error) {
        console.log(error)
    }
}

// MATCH (flashcardName,flashcardContent) 
//         AGAINST (?)
async function findFlashcardByFullTextFlashcard(searchValue) {
    try {
        const sql = `select flashcardId,
             flashcardName,
              statusId,
               dateOfCreate,
                accountId,
                 lessionId,
                  flashcardContent
                   from tbl_flashcards where MATCH (flashcardName,flashcardContent) 
                   AGAINST (? WITH QUERY EXPANSION) or flashcardName LIKE ? or flashcardContent LIKE ? 
                   and statusId != 3`;
        const params = [
            `%${searchValue}%`,
            `%${searchValue}%`,
            `%${searchValue}%`


        ];
        const result = await db.query(sql, params)
        const data = helper.emptyOrRows(result)
        return data;
    } catch (error) {
        console.log(error)
    }
}
async function increaseViewByClickByFlashcardId(flashcardId) {
    try {
        const sql = `update tbl_flashcards set numOfview = (numOfview + 1) where flashcardId = ?`;
        const params = [
            `${flashcardId}`
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
    createFlashcard,
    findFlashcardByName,
    getAllFlashcard,
    getFlashcardByFlashcardId,
    // getFlashcardByAcountId,
    getFlashcardByLessionId,
    UpdateFlashcardByID,
    getFlashcardByMe,
    updateFlashcardStatus,
    getFlashcardByArrayLessionId,
    getFlashcardByArrayLessionIdAndFilteredInfo,
    getPublicFlashcardByLessionId,
    findFlashcardByFullTextFlashcard,
    increaseViewByClickByFlashcardId
}
