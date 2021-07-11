const db = require('./db');
const helper = require('../helper');

async function getAllRole() {
    try {
        const sql = `SELECT id, roleName,description from tbl_role`;
        const rows = await db.query(sql);
        const data = helper.emptyOrRows(rows);
        return data;
    } catch (error) {
        console.log(error.message)
        return null;
    }
}

async function getAllRoleWithOutAdmin() {
    try {
        const sql = `SELECT id, roleName, description from tbl_role where roleName != ?`
        const params = [`${'admin'}`]
        const rows = await db.query(sql, params)
        const data = helper.emptyOrRows(rows)
        return data;
    } catch (error) {
        console.log(error)
        return []
    }
}

module.exports = {
    getAllRole,
    getAllRoleWithOutAdmin
}