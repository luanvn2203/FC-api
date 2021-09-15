
const donorServiceRelationAccountService = require('../../service/donorServiceRelationAccount')
const serviceDetailService = require('../../service/serviceDetail')
const donorServiceService = require('../../service/donorServiceService')
const accountService = require('../../service/account')
const { savePointHistory } = require('../../service/pointHistory')
const mailer = require('../../mailer')
module.exports = {
    saveRelation: async function (req, res, next) {
        try {
            const receiverEmail = req.body.params.email
            const listServiceDetail = req.body.params.listServiceDetail
            const totalPoint = req.body.params.total
            const isAdminSend = req.body.params.isAdminSend
            if (listServiceDetail.length > 0) {
                const accountFound = await accountService.findAccountByEmail(receiverEmail)
                console.log(accountFound)
                if (accountFound.length > 0) {

                    if (accountFound[0].point >= totalPoint) {

                        const isMinusPoint = await accountService.minusPointToAccountByEmail(receiverEmail, totalPoint)
                        if (isMinusPoint) {
                            const useType = 7
                            const description = `${receiverEmail} use ${totalPoint} point to exchange gift`
                            await savePointHistory(receiverEmail, totalPoint, useType, description)
                            const listServiceDetailFound = []
                            const listIdFound = []
                            for (let index = 0; index < listServiceDetail.length; index++) {
                                const serviceDetailFound = await serviceDetailService.getAvailableServiceDetailInformationById(listServiceDetail[index].serviceDetailId)
                                if (serviceDetailFound.length > 0) {
                                    listServiceDetailFound.push(serviceDetailFound[0])
                                    listIdFound.push(serviceDetailFound[0].id)
                                }
                            }
                            if (listServiceDetailFound.length === listServiceDetail.length) {
                                // console.log(listServiceDetailFound)
                                const quantityError = []
                                for (let index2 = 0; index2 < listServiceDetailFound.length; index2++) {
                                    if (listServiceDetailFound[index2].quantity < listServiceDetail[index2].quantity) {
                                        quantityError.push(listServiceDetail[index2])
                                    }
                                }
                                if (quantityError.length > 0) {
                                    res.status(202).json({
                                        status: "Failed",
                                        message: "Item quantity is not correct",
                                        item: quantityError
                                    })
                                } else {
                                    const errorObject = []
                                    for (let index3 = 0; index3 < listServiceDetailFound.length; index3++) {
                                        const donorServiceFound = await donorServiceService.getServiceById(listServiceDetailFound[index3].serviceId)
                                        if (donorServiceFound.length > 0) {
                                            if (donorServiceFound[0].serviceTypeId === 3) {

                                                const quantityDB = listServiceDetailFound[index3].quantity
                                                await serviceDetailService.updateServiceDetailQuantity(listServiceDetailFound[index3].id, (quantityDB - listServiceDetail[index3].quantity))
                                                if (quantityDB === listServiceDetail[index3].quantity) {
                                                    const unavailableStatus = 4
                                                    await serviceDetailService.updateDetailStatusById(listServiceDetailFound[index3].id, unavailableStatus)
                                                }

                                                const result = await donorServiceRelationAccountService.saveServiceRelationToAccount(receiverEmail, listServiceDetailFound[index3].id, listServiceDetail[index3].quantity)
                                                if (result !== true) {
                                                    errorObject.push(listServiceDetail[index3])
                                                }

                                            } else {
                                                // code
                                                const unavailableStatus = 4
                                                await serviceDetailService.updateDetailStatusById(listServiceDetailFound[index3].id, unavailableStatus)
                                                const result = await donorServiceRelationAccountService.saveServiceRelationToAccount(receiverEmail, listServiceDetailFound[index3].id, 1)
                                                if (result !== true) {
                                                    errorObject.push(listServiceDetail[index3])
                                                }
                                            }
                                        }
                                    }
                                    if (errorObject.length === 0) {
                                        res.status(200).json({
                                            status: "Success",
                                            message: "Exchange successfully, gift information is send to you email address, please checking your email"
                                        })

                                        //send mail
                                        let infor = ``
                                        listServiceDetailFound.map((item, index) => {
                                            return infor = infor + `<p> ${index + 1} ) ${item.serviceContent}</p>`
                                        })
                                        let subject = "You has exchanges gift FC website";
                                        let body = `
                                        <h2>Hi there, </h2>
                                        <h2>You receive this email by exchange gift on the flashcard system.</h2>
                                        <h3>Here is your gift information: ${infor} </h3>
                                        <h4>Vui lòng không reply. Trân trọng !</h4>
                                        `
                                        //sendEmail
                                        mailer.sendMail(receiverEmail, subject, body).catch(error => {
                                            console.log(error.message)
                                        })
                                    } else {
                                        res.status(202).json({
                                            status: "Failed",
                                            message: "Exchange failed, item not available",
                                            ErrorItem: errorObject
                                        })
                                    }
                                }
                            } else {
                                const errorItem = listServiceDetail.filter((item, index) => listIdFound.includes(item.serviceDetailId) === false)
                                res.status(202).json({
                                    status: "Failed",
                                    message: "Item not available ",
                                    ErrorItem: errorItem
                                })
                            }
                        }
                    } else {
                        res.status(202).json({
                            status: "Failed",
                            message: "Account don't have enough point to exchange",
                        })
                    }
                } else {
                    res.status(202).json({
                        status: "Failed",
                        message: "Not found receiver",
                    })
                }
            } else {
                res.status(202).json({
                    status: "Failed",
                    message: "Not found service "
                })
            }
        } catch (error) {
            console.log(error)
        }
    },
    viewReceivedServiceHistoryByMe: async function (req, res, next) {
        try {
            const userEmail = req.userEmail;
            const result = await donorServiceRelationAccountService.viewHistoryReceiveService(userEmail)
            if (result.length > 0) {
                res.status(200).json({
                    status: "Success",
                    listServices: result,
                    total: result.length
                })
            } else {
                res.status(202).json({
                    status: "Failed",
                    listServices: result,
                    total: result.length
                })
            }
        } catch (error) {
            console.log(error)
        }
    },

    getAllAvailableService: async function (req, res, next) {
        try {
            const result = await serviceDetailService.getAllAvailableService()
            if (result.length > 0) {
                for (let index = 0; index < result.length; index++) {
                    result[index].quantity = JSON.parse(result[index].quantity)
                }

                res.status(200).json({
                    status: "Success",
                    listServices: result,
                    total: result.length
                })
            } else {
                res.status(200).json({
                    status: "Failed",
                    listServices: result,
                    total: result.length
                })
            }

        } catch (error) {
            console.log(error)
        }
    }
}
