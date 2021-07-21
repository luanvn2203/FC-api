const db = require('./db');
const helper = require('../helper');

async function savePointHistory(accountId, point, typeOfUse, usingDescription) {
    try {
        //get current datetime
        let current = new Date();
        let cDate = current.getFullYear() + '-' + (current.getMonth() + 1) + '-' + current.getDate();
        let cTime = current.getHours() + ":" + current.getMinutes() + ":" + current.getSeconds();
        let dateTime = cDate + ' ' + cTime;

        const sql = `Insert into tbl_point_history(accountId, point, typeOfUse, usingDescription, dateOfUse) 
        values(?,?,?,?,?)`
        const params = [
            `${accountId}`,
            `${point}`,
            `${typeOfUse}`,
            `${usingDescription}`,
            `${dateTime}`,
        ]
        const result = await db.query(sql, params)
        if (result.affectedRows) {
            return result.insertId
        } else {
            return -1
        }

    } catch (error) {
        console.log(error)
    }
}
async function getAllPointHistoryByEmail(email, sortType) {
    try {
        const sql = `select ph.id,
        ph.accountId,
        ph.point,
        ph.typeOfUse as typeId,
        ph.usingDescription,
        ph.dateOfUse,
        pt.type as typeName
       from tbl_point_history ph, tbl_point_type pt where ph.typeOfUse = pt.id and  accountId = ? 
       order by ph.dateOfUse ${sortType}`
        const params = [
            `${email}`
        ]
        const result = db.query(sql, params)
        const data = helper.emptyOrRows(result)
        return data
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    savePointHistory,
    getAllPointHistoryByEmail
}