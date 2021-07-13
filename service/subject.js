const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function createNewSubject(subjectParams, student) {
    try {
        // console.log(subjectParams);
        // console.log(student);
        const sql = `insert into 
        tbl_subject(subjectName, accountId, topicId, subjectDescription, createdDate, statusId, numOfView)
         value(?,?,?,?,?,?,?)`;

        const subject = subjectParams.params;
        console.log(subject)
        let current = new Date();
        let cDate = current.getFullYear() + '-' + (current.getMonth() + 1) + '-' + current.getDate();
        let cTime = current.getHours() + ":" + current.getMinutes() + ":" + current.getSeconds();
        let dateTime = cDate + ' ' + cTime;

        const params = [
            `${subject.subjectName.trim()}`,
            `${student}`,
            `${subject.topicId}`,
            `${subject.subjectDescription.trim()}`,
            `${dateTime}`,
            `${subject.statusId}`,
            `${0}`
        ]

        const result = await db.query(sql, params);
        console.log(result.affectedRows)
        if (result.affectedRows) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.log(error)
    }
}

async function getAllSubjectByTopicId(topicId) {
    try {
        const sql = 'select subjectId, subjectName, accountId, topicId, subjectDescription, createdDate, statusId from tbl_subject where topicId = ? order by createdDate desc';
        const params = [`${topicId}`]
        const rows = await db.query(sql, params);
        const result = helper.emptyOrRows(rows);
        console.log(result);
        return result;
    } catch (error) {
        console.log(error);
    }
}


async function getAllSubjectInListTopicId(IdArray) {
    console.log(IdArray)
    try {
        const sql = `SELECT subjectId,
         subjectName, 
         accountId, 
         topicId, 
         subjectDescription, 
         createdDate, 
         statusId FROM tbl_subject 
         where topicId in (${IdArray}) order by createdDate desc`

        const result = await db.query(sql);
        const data = helper.emptyOrRows(result);
        return data;

    } catch (error) {
        console.log(error)
    }
}

async function updateSubject(subjectParams) {
    const subject = subjectParams.params;
    try {
        const sql = `update tbl_subject set subjectName = ?, subjectDescription = ?, statusId = ? where subjectId =?`;
        const params = [
            `${subject.subjectName}`,
            `${subject.subjectDescription}`,
            `${subject.statusId}`,
            `${subject.subjectId}`
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

async function getTop5SubjectByTopicId(paramsId, status) {
    const id = paramsId;
    console.log(id)
    try {
        const sql = `SELECT 
        s.subjectId,
        s.subjectName, 
        a.fullName as author,
         s.topicId, 
         s.subjectDescription,
         s.statusId 
         FROM tbl_subject s,
          tbl_account a where s.accountId = a.email 
          and topicId = ? and s.statusId = ? order by s.createdDate desc LIMIT 5  `

        const params = [
            `${id}`,
            `${status}`
        ]
        const rows = await db.query(sql, params);
        const data = helper.emptyOrRows(rows)
        return data;

    } catch (error) {
        console.log(error)
    }
}
async function findSubjectBySubjectNameAndUserAccount(subjectParams, student) {
    try {
        const subject = subjectParams.params;
        const sql = `SELECT subjectId,
    subjectName, 
    accountId, 
    topicId, 
    subjectDescription, 
    createdDate, 
    statusId FROM tbl_subject 
    where accountId = ? and subjectName = ? and topicId = ?`
        const params = [
            `${student}`,
            `${subject.subjectName}`,
            `${subject.topicId}`
        ]
        const rows = await db.query(sql, params);
        const data = helper.emptyOrRows(rows)
        return data;
    } catch (error) {
        console.log(error)
    }
}
async function getSubjectBySignedInEmail(email) {
    try {
        const sql = `SELECT subjectId,
    subjectName, 
    accountId, 
    topicId, 
    subjectDescription, 
    createdDate, 
    statusId FROM tbl_subject 
    where accountId = ? and statusId != 3 order by createdDate desc`;
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
async function getSubjectByEmail(email) {
    try {
        const sql = `SELECT subjectId,
    subjectName, 
    accountId, 
    topicId, 
    subjectDescription, 
    createdDate, 
    statusId FROM tbl_subject 
    where accountId = ? order by createdDate desc `;
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

async function updateSubjectStatus(subjectId, status, author) {
    try {

        const sql = `UPDATE tbl_subject set statusId = ? where subjectId = ? and accountId = ?`
        const params = [
            `${status}`,
            `${subjectId}`,
            `${author}`
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

async function getSubjectByTopicId(paramsId) {
    const id = paramsId;
    try {
        const sql = `SELECT 
        s.subjectId,
        s.subjectName, 
        a.fullName as author,
         s.topicId, 
         s.subjectDescription,
         s.statusId,
         s.createdDate
         FROM tbl_subject s,
          tbl_account a where s.accountId = a.email 
          and topicId = ? order by createdDate desc`

        const params = [
            `${id}`
        ]
        const rows = await db.query(sql, params);
        const data = helper.emptyOrRows(rows)
        return data;

    } catch (error) {
        console.log(error)
    }
}

async function findSubjectByNameAndDes(searchValue) {
    try {
        const sql = `SELECT s.subjectId,
        s.subjectName,
        s.accountId,
        s.topicId,
        s.subjectDescription,
        s.createdDate,
        s.statusId,
        a.fullName as author
            FROM tbl_subject s, tbl_account a WHERE s.accountId = a.email and 
            MATCH (subjectName,subjectDescription) AGAINST (? WITH QUERY EXPANSION) 
            and s.statusId != 3`;
        //searhc thi phai co public lan private de request
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

async function findSubjectByLessionNameAndDes(searchValue) {
    try {
        const sql = `select  s.subjectId,
          s.subjectName, 
           s.accountId,
             s.topicId, 
              s.subjectDescription,
                s.createdDate,
                  s.statusId,
                   a.fullName as author
        from tbl_subject s, tbl_account a where s.accountId = a.email and subjectId in (SELECT distinct subjectId FROM tbl_lession 
        WHERE MATCH (lessionName,lessionDescription) AGAINST (? WITH QUERY EXPANSION ) and s.statusId != 3)`;
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

async function findSubjectByftFlashcardName(searchValue) {
    try {
        const sql = `select s.subjectId,  
        s.subjectName,  
        s.accountId,  
        s.topicId,  
        s.subjectDescription,  
        s.createdDate,  
        s.statusId, 
        a.fullName as author
        from tbl_subject s, tbl_account a where s.accountId = a.email and subjectId 
        in (select distinct subjectId from tbl_lession where lessionId in 
        (select distinct lessionId from tbl_flashcards where MATCH (flashcardName) 
        AGAINST (? WITH QUERY EXPANSION) and s.statusId != 3))`;
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

async function findSubjectByftQuestionContent(searchValue) {
    try {
        const sql = `select distinct flashcardId from tbl_question where 
        MATCH (questionContent) AGAINST (? WITH QUERY EXPANSION) and statusId != 3`;
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
async function getSubjecDetailById(subjectId) {
    try {
        const sql = `SELECT subjectId, subjectName, accountId, topicId, subjectDescription, createdDate, statusId  
    from tbl_subject
    where subjectId = ?`;
        const params = [
            `${subjectId}`
        ]
        const result = await db.query(sql, params);
        const data = helper.emptyOrRows(result)
        return data;
    } catch (error) {
        console.log(error)
    }
}

async function increaseViewByClickBySubjectId(subjectId) {
    try {
        const sql = `update tbl_subject set numOfview = (numOfview + 1) where subjectId = ?`;
        const params = [
            `${subjectId}`
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
    createNewSubject,
    getAllSubjectByTopicId,
    getAllSubjectInListTopicId,
    updateSubject,
    increaseViewByClickBySubjectId,

    getTop5SubjectByTopicId,
    findSubjectBySubjectNameAndUserAccount,
    getSubjectBySignedInEmail,
    getSubjectByEmail,
    getSubjecDetailById,

    updateSubjectStatus,
    getSubjectByTopicId,



    findSubjectByNameAndDes,
    findSubjectByLessionNameAndDes,
    findSubjectByftFlashcardName,
    findSubjectByftQuestionContent


}
