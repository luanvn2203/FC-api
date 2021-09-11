const db = require('./db');
const helper = require('../helper');

async function saveServiceDetail(serviceId, serviceContent, startDate, endDate, quantity, isConfirmed) {
    try {
        const sql = `INSERT INTO tbl_service_detail( serviceId, serviceContent, startDate, endDate, quantity)
    values(?,?,?,?,?)`;
        const params = [
            `${serviceId}`,
            `${serviceContent}`,
            `${startDate}`,
            `${endDate}`,
            `${quantity}`
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
async function getAvailableServiceDetailInformationById(serviceDetailId) {
    try {
        const sql = `select id, serviceId, serviceContent, startDate, endDate, quantity , statusId
        from  tbl_service_detail
        where id = ? and statusId != 3 and statusId != 4 `
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

async function updateServiceDetailQuantity(serviceDetailId, quantity) {
    try {
        const sql = `UPDATE tbl_service_detail set quantity = ? where id = ?`
        const params = [
            `${quantity}`,
            `${serviceDetailId}`
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

async function getAllAvailableService() {
    try {
        const sql = `select sd.id, sd.serviceId, ds.serviceName, ds.serviceTypeId , serviceInformation, sum(sd.quantity) as quantity, sd.startDate ,sd.endDate
        from tbl_service_detail sd, tbl_donor_service ds
        where sd.serviceId = ds.id and  sd.statusId = 1 and ds.isConfirmed = 1 group by sd.serviceId,sd.startDate ,sd.endDate `
        const result = await db.query(sql)
        const data = helper.emptyOrRows(result)
        return data
    } catch (error) {
        console.log(error)
    }
}


module.exports = {
    saveServiceDetail,
    getAllDetailByServiceId,
    updateDetailStatusByServiceId,
    getServiceDetailInformationById,
    updateDetailStatusById,
    updateServiceDetailQuantity,

    getAllAvailableService,
    getAvailableServiceDetailInformationById
}