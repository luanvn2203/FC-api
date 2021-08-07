
const donorServiceRelationAccountService = require('../../service/donorServiceRelationAccount')
const serviceDetailService = require('../../service/serviceDetail')
const donorServiceService = require('../../service/donorServiceService')
const mailer = require('../../mailer')

module.exports = {
    saveRelation: async function (req, res, next) {
        try {
            const receiverEmail = req.body.params.email
            const listServiceDetail = req.body.params.listServiceDetail

            if (listServiceDetail.length > 0) {
                const listServiceDetailFound = []
                const listIdFound = []
                for (let index = 0; index < listServiceDetail.length; index++) {
                    const serviceDetailFound = await serviceDetailService.getAvailableServiceDetailInformationById(listServiceDetail[index].serviceDetailId)
                    if (serviceDetailFound.length > 0) {
                        listServiceDetailFound.push(serviceDetailFound[0])
                        listIdFound.push(serviceDetailFound[0].id)
                    }
                }
                console.log(listServiceDetailFound)
                console.log(listServiceDetail)

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
                                message: "Exchange successfully"
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







                // if (serviceDetailFound.length > 0) {
                //     if (serviceDetailFound[0].statusId !== 4) {
                //         const donorServiceFound = await donorServiceService.getServiceById(serviceDetailFound[0].serviceId)
                //         if (donorServiceFound.length > 0) {
                //             if (donorServiceFound[0].serviceTypeId === 3) {
                //                 //hien vat
                //                 const quantityDB = serviceDetailFound[0].quantity
                //                 if (quantityDB >= quantity) {
                //                     await serviceDetailService.updateServiceDetailQuantity(listServiceDetail[index].serviceDetailId, (quantityDB - quantity))
                //                     if (quantityDB === quantity) {
                //                         const unavailableStatus = 4
                //                         await serviceDetailService.updateDetailStatusById(listServiceDetail[index].serviceDetailId, unavailableStatus)
                //                     }
                //                     const result = await donorServiceRelationAccountService.saveServiceRelationToAccount(receiverEmail, listServiceDetail[index].serviceDetailId, quantity)
                //                     if (result === true) {
                //                         // tru so luong
                //                         res.status(200).json({
                //                             status: "Success",
                //                             message: "Save service relation successfully"
                //                         })
                //                     } else {
                //                         res.status(202).json({
                //                             status: "Failed",
                //                             message: "Save service relation failed"
                //                         })
                //                     }
                //                 }
                //             } else {
                //                 // code
                //                 const unavailableStatus = 4
                //                 await serviceDetailService.updateDetailStatusById(serviceDetailId, unavailableStatus)
                //                 const result = await donorServiceRelationAccountService.saveServiceRelationToAccount(receiverEmail, serviceDetailId, 1)
                //                 if (result === true) {
                //                     res.status(200).json({
                //                         status: "Success",
                //                         message: "Save service relation successfully"
                //                     })
                //                 } else {
                //                     res.status(202).json({
                //                         status: "Failed",
                //                         message: "Save service relation failed"
                //                     })
                //                 }
                //             }
                //         }
                //     } else {
                //         res.status(202).json({
                //             status: "Failed",
                //             message: "Service is unavailable"
                //         })
                //     }
                // } else {
                //     res.status(202).json({
                //         status: "Failed",
                //         message: "Not found service detail"
                //     })
                // }




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
