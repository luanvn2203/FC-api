
const donorServiceRelationAccountService = require('../../service/donorServiceRelationAccount')
const serviceDetailService = require('../../service/serviceDetail')
const donorServiceService = require('../../service/donorServiceService')

module.exports = {
    saveRelation: async function (req, res, next) {
        try {
            const emailReceive = req.body.params.email
            const serviceDetailId = req.body.params.serviceDetailId
            const quantity = req.body.params.quantity

            const serviceDetailFound = await serviceDetailService.getServiceDetailInformationById(serviceDetailId)


            if (serviceDetailFound.length > 0) {
                if (serviceDetailFound[0].statusId !== 4) {

                    const donorServiceFound = await donorServiceService.getServiceById(serviceDetailFound[0].serviceId)
                    console.log(donorServiceFound[0])
                    if (donorServiceFound.length > 0) {
                        if (donorServiceFound[0].serviceTypeId === 3) {
                            //hien vat
                            const quantityDB = serviceDetailFound[0].quantity
                            if (quantityDB >= quantity) {
                                await serviceDetailService.updateServiceDetailQuantity(serviceDetailId, (quantityDB - quantity))
                                if (quantityDB === quantity) {
                                    const unavailableStatus = 4
                                    await serviceDetailService.updateDetailStatusById(serviceDetailId, unavailableStatus)
                                }
                                const result = await donorServiceRelationAccountService.saveServiceRelationToAccount(emailReceive, serviceDetailId, quantity)
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
                            // code
                            const unavailableStatus = 4
                            await serviceDetailService.updateDetailStatusById(serviceDetailId, unavailableStatus)
                            const result = await donorServiceRelationAccountService.saveServiceRelationToAccount(emailReceive, serviceDetailId, 1)
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
                        }
                    }


                } else {
                    res.status(202).json({
                        status: "Failed",
                        message: "Service is unavailable"
                    })
                }
            } else {
                res.status(202).json({
                    status: "Failed",
                    message: "Not found service detail"
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
                    status: "Success",
                    listServices: result,
                    total: result.length
                })
            }
        } catch (error) {
            console.log(error)
        }
    }
}
