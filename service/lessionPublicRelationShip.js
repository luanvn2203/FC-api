const db = require('./db');
const helper = require('../helper');

async function saveRelationShip(accountId, lessionId) {
    try {
        let current = new Date();
        let cDate = current.getFullYear() + '-' + (current.getMonth() + 1) + '-' + current.getDate();
        let cTime = current.getHours() + ":" + current.getMinutes() + ":" + current.getSeconds();
        let dateTime = cDate + ' ' + cTime;
        const sql = 'INSERT INTO tbl_lession_public_relationship(lessionId, accountId, joinDate) values(?,?,?)'
        const params = [
            `${lessionId}`,
            `${accountId}`,
            `${dateTime}`
        ]
        const result = await db.query(sql, params);
        if (result.affectedRows) {
            return true
        } else {
            return false
        }

    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    saveRelationShip
}