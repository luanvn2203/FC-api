const db = require('./db');
const helper = require('../helper');

async function createNewService(donorId, serviceTypeId, serviceName, serviceInformation, quantity) {
    try {
        let current = new Date();
        let cDate = current.getFullYear() + '-' + (current.getMonth() + 1) + '-' + current.getDate();
        let cTime = current.getHours() + ":" + current.getMinutes() + ":" + current.getSeconds();
        let dateTime = cDate + ' ' + cTime;

        const sql = `INSERT INTO tbl_donor_service(donorId, serviceTypeId,serviceName, serviceInformation, createdDate, quantity)
         values(?,?,?,?,?,?)`;
        const params = [
            `${donorId}`,
            `${serviceTypeId}`,
            `${serviceName}`,
            `${serviceInformation}`,
            `${dateTime}`,
            `${quantity}`
        ]
        const result = await db.query(sql, params);
        if (result.affectedRows) {
            return result.insertId
        } else {
            return -1
        }
    } catch (error) {
        console.log(error)
    }
}

async function updateServiceInformation(serviceInfo) {
    try {
        const sql = `Update tbl_donor_service set 
            serviceName = ?, 
            serviceTypeId = ?, 
            serviceInformation = ?, 
            quantity = ?
            where id = ?`;
        const params = [
            `${serviceInfo.serviceName}`,
            `${serviceInfo.serviceTypeId}`,
            `${serviceInfo.serviceInformation}`,
            `${serviceInfo.quantity}`,
            `${serviceInfo.serviceId}`,
        ]
        const result = await db.query(sql, params);
        if (result.affectedRows) {
            return true
        } else {
            return false
        }

    } catch (error) {
        console.log(error)
    } ry
}

async function getServiceById(serviceId) {
    try {
        const sql = `select id, 
        donorId, 
        serviceName, 
        serviceTypeId, 
        serviceInformation, 
        createdDate, 
        quantity from tbl_donor_service where id = ?`
        const params = [
            `${serviceId}`
        ]
        const result = await db.query(sql, params);
        const data = helper.emptyOrRows(result);
        return data

    } catch (error) {
        console.log(error)
    }
}

async function updateServiceStatus(serviceId, statusId) {
    try {
        const sql = `Update tbl_donor_service set 
            statusId = ?
            where id = ? `;
        const params = [
            `${statusId}`,
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

async function getAllServiceByEmail(donorEmail) {
    try {
        const sql = `select ds.id, 
        ds.donorId, 
        ds.serviceName, 
        ds.serviceTypeId, 
        ds.serviceInformation, 
        ds.createdDate,
        ds.quantity, 
        ds.statusId,
        a.fullName
        from tbl_donor_service ds, tbl_account a
        where ds.donorId = a.email and ds.donorId = ? and ds.statusId != 3 
        order by ds.createdDate desc`;
        const params = [
            `${donorEmail}`
        ]
        const result = await db.query(sql, params);
        const data = helper.emptyOrRows(result);
        return data
    } catch (error) {
        console.log(error)
    }
}


module.exports = {
    createNewService,
    updateServiceInformation,
    getServiceById,
    updateServiceStatus,
    getAllServiceByEmail
}