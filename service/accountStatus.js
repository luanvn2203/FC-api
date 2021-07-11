const db = require('./db');
const helper = require('../helper');

async function getAllAccountStatus() {
    try {
        const sql = `SELECT id, statusName,description from tbl_accountstatus`;
        const rows = await db.query(sql);
        const data = helper.emptyOrRows(rows);
        return data;
    } catch (error) {
        console.log(error.message)
        return null;
    }
}

module.exports = {
    getAllAccountStatus
}