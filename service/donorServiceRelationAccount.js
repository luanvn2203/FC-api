const db = require('./db');
const helper = require('../helper');

async function saveServiceRelationToAccount(accountId, serviceDetailId, quantity) {
    try {
        let current = new Date();
        let cDate = current.getFullYear() + '-' + (current.getMonth() + 1) + '-' + current.getDate();
        let cTime = current.getHours() + ":" + current.getMinutes() + ":" + current.getSeconds();
        let dateTime = cDate + ' ' + cTime;
        const sql = `INSERT INTO tbl_donorservice_relation_account(accountId, serviceDetailId, dateOfReceived, quantity) 
        values(?,?,?,?)`;
        const params = [
            `${accountId}`,
            `${serviceDetailId}`,
            `${dateTime}`,
            `${quantity}`
        ]
        const result = await db.query(sql, params)
        if (result.affectedRows) {
            return true;
        } else {
            return false
        }

    } catch (error) {
        console.log(error)
    }
}
// Select dra.id, dra.serviceDetailId, 
// dra.dateOfReceived,dra.quantity, sd.serviceContent, sd.startDate, sd.endDate,
// ds.serviceName, ds.serviceTypeId, ds.serviceInformation,
// st.typeName as serviceTypeName
// from tbl_donorservice_relation_account dra ,
// tbl_service_detail sd,
// tbl_donor_service ds,
// tbl_service_type st
// where dra.serviceDetailId = sd.id 
// and sd.serviceId = ds.id
// and ds.serviceTypeId = st.id
// and accountId = 'luanvnse632@gmail.com'
// group by dra.id order by dra.dateOfReceived desc

async function viewHistoryReceiveService(email) {
    try {
        const sql = `Select dra.id, 
        dra.dateOfReceived,dra.quantity, sd.serviceContent, sd.startDate, sd.endDate,
        ds.serviceName,  ds.serviceInformation,
        st.typeName as serviceTypeName
        from tbl_donorservice_relation_account dra ,
        tbl_service_detail sd,
        tbl_donor_service ds,
        tbl_service_type st
        where dra.serviceDetailId = sd.id 
        and sd.serviceId = ds.id
        and ds.serviceTypeId = st.id
        and accountId = ?
        group by dra.id order by dra.dateOfReceived desc`;
        const params = [
            `${email}`
        ]
        const result = await db.query(sql, params);
        const data = helper.emptyOrRows(result)
        return data
    } catch (error) {
        console.log(error)
    }
}

async function getRelationByid(id) {
    try {
        const sql = `Select id, accountId, serviceDetailId, dateOfReceived from tbl_donorservice_relation_account where id = ? `;
        const params = [
            `${id}`
        ]
        const result = await db.query(sql, params);
        const data = helper.emptyOrRows(result)
        return data
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    saveServiceRelationToAccount,
    viewHistoryReceiveService,
    getRelationByid
}