const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getAllTopic(page = 1) {
    const offset = helper.getOffset(page, config.listPerPage);
    const sql = `SELECT 
    topicId,
    topicName,
    topicDescription
    FROM tbl_topic where statusId = 1 limit ? offset ?`;

    const params = [`${config.listPerPage}`, `${offset}`]
    const rows = await db.query(sql, params);
    const data = helper.emptyOrRows(rows);
    const meta = { page, total: data.length };
    return {
        data,
        meta
    }
}

async function findTopicByName(topicName) {
    const sql = `SELECT 
    topicId,
    topicName,
    accountId 
    FROM tbl_topic where topicName = ? `;

    const params = [`${topicName}`]
    const rows = await db.query(sql, params);
    const data = helper.emptyOrRows(rows);
    return data;
}

async function getTopicById(topicId) {
    const sql = `SELECT 
    topicId,
    topicName,
    accountId 
    FROM tbl_topic
    WHERE topicId = ?`;

    const params = [`${topicId.params.id}`]
    const rows = await db.query(sql, params);
    const data = helper.emptyOrRows(rows);
    return data;
}

async function createNewTopic(topicParams, student) {
    try {
        const sql = `Insert into 
        tbl_topic(topicName, accountId, topicDescription, createdDate, statusId) 
        values(?,?,?,?,?)`;
        const topic = topicParams.params;

        let current = new Date();
        let cDate = current.getFullYear() + '-' + (current.getMonth() + 1) + '-' + current.getDate();
        let cTime = current.getHours() + ":" + current.getMinutes() + ":" + current.getSeconds();
        let dateTime = cDate + ' ' + cTime;

        const params = [
            `${topic.topicName.trim()}`,
            `${student}`,
            `${topic.topicDescription.trim()}`,
            `${dateTime}`,
            `${topic.statusId}`,
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

async function searchByName(topicName) {
    try {
        const sql = `select topicId, topicName, topicDescription, createdDate, statusId from tbl_topic where topicName like ? `;
        const params = [
            `%${topicName.params.topicName}%`
        ]
        const result = await db.query(sql, params);
        const data = helper.emptyOrRows(result);
        console.log(data)
        return data;

    } catch (error) {
        console.log(error)
    }
}

async function findemail(email) {
    try {
        const sql = `select topicId, 
        topicName,
         accountId,
         topicDescription,
          createdDate, 
          statusId from tbl_topic where accountId = ? and statusId != 3 order by createdDate desc`;
        const params = [
            `${email}`
        ]
        const result = await db.query(sql, params);
        const data = helper.emptyOrRows(result);
        return data;
    } catch (error) {
        console.log(error)
    }
}

async function getAllTopicInArrayOfId(IdArray) {
    try {

        const sql = `SELECT topicId,topicName,topicDescription,accountId,createdDate,statusId FROM tbl_topic where topicId in (${IdArray})`
        const result = await db.query(sql);
        const data = helper.emptyOrRows(result);
        return data;
    } catch (error) {
        console.log(error)
    }
}

async function updateTopicStatus(topicId, status, userEmail) {
    try {
        const sql = `UPDATE tbl_topic set statusId = ? where topicId = ? and accountId = ?`;
        const params = [
            `${status}`,
            `${topicId}`,
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

module.exports = {
    getAllTopic,
    getTopicById,
    createNewTopic,
    findTopicByName,
    searchByName,
    findemail,
    getAllTopicInArrayOfId,
    updateTopicStatus,
}

