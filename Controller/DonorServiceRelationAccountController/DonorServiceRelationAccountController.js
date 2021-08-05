
const donorServiceRelationAccountService = require('../../service/donorServiceRelationAccount')
const serviceDetailService = require('../../service/serviceDetail')
const donorServiceService = require('../../service/donorServiceService')

module.exports = {
    saveRelation: async function (req, res, next) {
        try {
            const emailReceive = req.body.params.email
            const donorServiceId = req.body.params.serviceId
            const quantity = req.body.params.quantity

            const donorServiceFound = await donorServiceService.getServiceById(donorServiceId)
            if (donorServiceFound.length > 0) {
                if (donorServiceFound[0].serviceTypeId === 3) {
                    // hien vat
                    const serviceDetailFound = await serviceDetailService.getAllDetailByServiceId(donorServiceId)
                    if (serviceDetailFound.length > 0) {
                        if (serviceDetailFound[0].statusId !== 4) {
                            const quantityDB = serviceDetailFound[0].quantity
                            if (quantityDB >= quantity) {
                                await serviceDetailService.updateServiceDetailQuantity(serviceDetailFound[0].id, (quantityDB - quantity))
                                if (quantityDB === quantity) {
                                    const unavailableStatus = 4
                                    await serviceDetailService.updateDetailStatusById(serviceDetailFound[0].id, unavailableStatus)
                                }
                                const result = await donorServiceRelationAccountService.saveServiceRelationToAccount(emailReceive, serviceDetailFound[0].id, quantity)
                                if (result === true) {
                                    // tru so luong
                                    res.status(200).json({
                                        status: "Success",
                                        message: "Save service relation successfully"
                                    })
                                } else {
                                    res.status(202).json({
                                        status: "Failed",
                                        message: "Save service relation failed"
                                    })
                                }
                            }
                        } else {
                            res.status(202).json({
                                status: "Failed",
                                message: "Item is not available: " + donorServiceId
                            })
                        }
                    }

                } else {
                    // code
                    const serviceDetailFound = await serviceDetailService.getAllDetailByServiceId(donorServiceId)
                    if (serviceDetailFound.length > 0) {
                        const availableServiceDetail = serviceDetailFound.filter((item, index) => item.statusId !== 4)
                        if (availableServiceDetail.length > 0) {
                            const unavailableStatus = 4
                            await serviceDetailService.updateDetailStatusById(availableServiceDetail[0].id, unavailableStatus)
                            const result = await donorServiceRelationAccountService.saveServiceRelationToAccount(emailReceive, availableServiceDetail[0].id, 1)
                            if (result === true) {
                                res.status(200).json({
                                    status: "Success",
                                    message: "Save service relation successfully"
                                })
                            } else {
                                res.status(202).json({
                                    status: "Failed",
                                    message: "Save service relation failed"
                                })
                            }
                        } else {
                            res.status(202).json({
                                status: "Failed",
                                message: "Item is not available: " + donorServiceId
                            })
                        }
                    }


                }

            } else {
                res.status(202).json({
                    status: "Failed",
                    message: "Not found service ID: " + donorServiceId
                })
            }



            // const serviceDetailFound = await serviceDetailService.getServiceDetailInformationById(serviceDetailId)
            // if (serviceDetailFound.length > 0) {
            //     if (serviceDetailFound[0].statusId !== 4) {
            //         const donorServiceFound = await donorServiceService.getServiceById(serviceDetailFound[0].serviceId)
            //         console.log(donorServiceFound[0])
            //         if (donorServiceFound.length > 0) {
            //             if (donorServiceFound[0].serviceTypeId === 3) {
            //                 //hien vat
            //                 const quantityDB = serviceDetailFound[0].quantity
            //                 if (quantityDB >= quantity) {
            //                     await serviceDetailService.updateServiceDetailQuantity(serviceDetailId, (quantityDB - quantity))
            //                     if (quantityDB === quantity) {
            //                         const unavailableStatus = 4
            //                         await serviceDetailService.updateDetailStatusById(serviceDetailId, unavailableStatus)
            //                     }
            //                     const result = await donorServiceRelationAccountService.saveServiceRelationToAccount(emailReceive, serviceDetailId, quantity)
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
            //                 const result = await donorServiceRelationAccountService.saveServiceRelationToAccount(emailReceive, serviceDetailId, 1)
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
