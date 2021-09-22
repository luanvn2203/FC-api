const db = require('./db');
const helper = require('../helper');

async function saveFeedBack(donorServiceRelationAccountId, accountId, point, content) {
    try {
        let current = new Date();
        let cDate = current.getFullYear() + '-' + (current.getMonth() + 1) + '-' + current.getDate();
        let cTime = current.getHours() + ":" + current.getMinutes() + ":" + current.getSeconds();
        let dateTime = cDate + ' ' + cTime;
        const sql = `INSERT INTO tbl_service_feedback(donorServiceRelationAccountId, accountId, point, content,dateOfFeedback) 
                    values(?,?,?,?,?)`
        const params = [
            `${donorServiceRelationAccountId}`,
            `${accountId}`,
            `${point}`,
            `${content}`,
            `${dateTime}`
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

async function findFeedbackByAccountIdAndServiceRelationAccountId(accountId, relationId) {
    try {
        const sql = `Select id, donorServiceRelationAccountId, accountId, point, content, dateOfFeedback 
        from tbl_service_feedback where accountId = ? and donorServiceRelationAccountId = ?`
        const params = [
            `${accountId}`,
            `${relationId}`
        ]
        const result = await db.query(sql, params)
        const data = helper.emptyOrRows(result)
        return data
    } catch (error) {
        console.log(error)
    }
}

async function viewAllFeedbackForAdmin() {
    try {
        const sql = `select sf.id, ds.serviceName,
        ds.serviceInformation,  sf.accountId,  sf.point,  sf.content,  sf.dateOfFeedback,
        sd.serviceContent,
        dra.quantity,
        ds.donorId
        from tbl_service_feedback sf, 
        tbl_donorservice_relation_account dra, 
        tbl_service_detail sd,
        tbl_donor_service ds
        where sf.donorServiceRelationAccountId = dra.id 
        and dra.serviceDetailId = sd.id
        and ds.id = sd.serviceId
        order by sf.dateOfFeedback desc`
        const result = await db.query(sql)
        const data = helper.emptyOrRows(result)
        return data
    } catch (error) {
        console.log(error)
    }
}

async function viewAllMyServiceFeedback(donorId) {
    try {
        const sql = `select sf.id, ds.serviceName,
        ds.serviceInformation,  sf.accountId,  sf.point,  sf.content,  sf.dateOfFeedback,
        sd.serviceContent,
        dra.quantity,
        ds.donorId
        from tbl_service_feedback sf, 
        tbl_donorservice_relation_account dra, 
        tbl_service_detail sd,
        tbl_donor_service ds
        where sf.donorServiceRelationAccountId = dra.id 
        and dra.serviceDetailId = sd.id
        and ds.id = sd.serviceId
        and ds.donorId = ?
        order by sf.dateOfFeedback desc`
        const params = [
            `${donorId}`
        ]
        const result = await db.query(sql, params)
        const data = helper.emptyOrRows(result)
        return data
    } catch (error) {
        console.log(error)
    }
}


module.exports = {
    saveFeedBack,
    findFeedbackByAccountIdAndServiceRelationAccountId,
    viewAllFeedbackForAdmin,
    viewAllMyServiceFeedback
}