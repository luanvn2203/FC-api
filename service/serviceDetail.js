const db = require('./db');
const helper = require('../helper');

async function saveServiceDetail(serviceId, serviceContent, startDate, endDate, quantity) {
    try {
        const sql = `INSERT INTO tbl_service_detail( serviceId, serviceContent, startDate, endDate, quantity)
    values(?,?,?,?,?)`;
        const params = [
            `${serviceId}`,
            `${serviceContent}`,
            `${startDate}`,
            `${endDate}`,
            `${quantity}`,
        ]
        const result = await db.query(sql, params)
        if (result.affectedRows) {
            return true
        } else {
            return false
        }
    } catch (error) {
        console.log(error)
    }
}

async function getAllDetailByServiceId(serviceId) {
    try {
        const sql = `select id, serviceId, serviceContent, startDate, endDate, quantity , statusId
        from  tbl_service_detail
        where serviceId = ? and statusId != 3 `
        const params = [
            `${serviceId}`
        ]
        const result = await db.query(sql, params)
        const data = helper.emptyOrRows(result)
        return data
    } catch (error) {
        console.log(error)
    }
}
async function updateDetailStatusByServiceId(serviceId, status) {
    try {
        const sql = `UPDATE tbl_service_detail set statusId = ? where serviceId = ? `
        const params = [
            `${status}`,
            `${serviceId}`
        ]
        const result = await db.query(sql, params)
        if (result.affectedRows) {
            return true
        } else {
            return false
        }

    } catch (error) {
        console.log(error)
    }
}

async function getServiceDetailInformationById(serviceDetailId) {
    try {
        const sql = `select id, serviceId, serviceContent, startDate, endDate, quantity , statusId
        from  tbl_service_detail
        where id = ? and statusId != 3 `
        const params = [
            `${serviceDetailId}`
        ]
        const result = await db.query(sql, params)
        const data = helper.emptyOrRows(result)
        return data
    } catch (error) {
        console.log(error)
    }
}
async function updateDetailStatusById(id, status) {
    try {
        const sql = `UPDATE tbl_service_detail set statusId = ? where id = ? `
        const params = [
            `${status}`,
            `${id}`
        ]
        const result = await db.query(sql, params)
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
    saveServiceDetail,
    getAllDetailByServiceId,
    updateDetailStatusByServiceId,
    getServiceDetailInformationById,
    updateDetailStatusById
}