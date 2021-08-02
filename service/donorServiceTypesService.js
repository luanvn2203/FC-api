const db = require('./db');
const helper = require('../helper');

async function getAllTServiceType() {
    try {
        const sql = 'select id, typeName, description from tbl_service_type'
        const result = await db.query(sql);
        const data = helper.emptyOrRows(result)
        return data
    } catch (error) {
        console.log(error)
    }
}


module.exports = {
    getAllTServiceType
}