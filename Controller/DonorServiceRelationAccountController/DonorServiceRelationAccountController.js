
const donorServiceRelationAccountService = require('../../service/donorServiceRelationAccount')
const serviceDetailService = require('../../service/serviceDetail')
module.exports = {
    saveRelation: async function (req, res, next) {
        try {
            const emailReceive = req.body.params.email
            const serviceDetailId = req.body.params.serviceDetailId

            const serviceDetailFound = await serviceDetailService.getServiceDetailInformationById(serviceDetailId)
            if (serviceDetailFound.length > 0) {
                if (serviceDetailFound[0].statusId !== 4) {
                    const unavailableStatus = 4
                    await serviceDetailService.updateDetailStatusById(serviceDetailId, unavailableStatus)
                    const result = await donorServiceRelationAccountService.saveServiceRelationToAccount(emailReceive, serviceDetailId)
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
