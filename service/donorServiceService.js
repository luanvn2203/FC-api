const db = require('./db');
const helper = require('../helper');

async function createNewService(donorId, serviceTypeId, serviceName, serviceInformation, quantity, isConfirmed) {
    try {
        let current = new Date();
        let cDate = current.getFullYear() + '-' + (current.getMonth() + 1) + '-' + current.getDate();
        let cTime = current.getHours() + ":" + current.getMinutes() + ":" + current.getSeconds();
        let dateTime = cDate + ' ' + cTime;

        const sql = `INSERT INTO tbl_donor_service(donorId, serviceTypeId,serviceName, serviceInformation, createdDate, quantity,isConfirmed)
         values(?,?,?,?,?,?,?)`;
        const params = [
            `${donorId}`,
            `${serviceTypeId}`,
            `${serviceName}`,
            `${serviceInformation}`,
            `${dateTime}`,
            `${quantity}`,
            `${isConfirmed}`
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
        console.log(serviceInfo)
        const sql = `Update tbl_donor_service set 
            serviceName = ?, 
            serviceInformation = ? 
            where id = ?`;

        const params = [
            `${serviceInfo.serviceName}`,
            `${serviceInfo.serviceInformation}`,
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
    }
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

async function confirmByAdmin(serviceId, isConfirmed, quantity) {
    try {
        let value = 0
        if (isConfirmed === false) {
            value = 0
        } else {
            value = 1
        }

        const sql = `update tbl_donor_service set isConfirmed = ? , quantity = ? where id = ? `
        const params = [
            `${value}`,
            `${quantity}`,
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

async function getAllServiceOrderByDate() {
    try {
        const sql = `SELECT id, donorId, serviceName, serviceTypeId, serviceInformation, createdDate, quantity, statusId, isConfirmed 
        FROM tbl_donor_service order by createdDate desc`
        const result = await db.query(sql)
        const data = helper.emptyOrRows(result)
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
    getAllServiceByEmail,
    confirmByAdmin,
    getAllServiceOrderByDate
}