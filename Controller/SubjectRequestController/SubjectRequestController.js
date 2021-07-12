
const subjectRequestService = require('../../service/subjectRequestService')
const subjectService = require('../../service/subject')
const subjectRelationAccountService = require('../../service/subjectRelationAccount')
module.exports = {
    sendViewSubjectRequest: async function (req, res, next) {
        try {
            const requestedAccount = req.userEmail.trim();
            const subjectId = req.body.params.subjectId;
            const subjectFound = await subjectService.getSubjecDetailById(subjectId)
            if (subjectFound.length > 0) {
                const subjectId = req.body.params.subjectId;
                const waittingStatus = 1;
                if (subjectFound[0].accountId !== requestedAccount) {
                    const result = await subjectRequestService.saveRequest(requestedAccount, subjectFound[0].accountId, subjectId, waittingStatus)
                    if (result !== -1) {
                        res.status(200).json({
                            status: "Success",
                            message: "Send request successfully, waiting for author approvement"
                        })
                    } else {
                        res.status(202).json({
                            status: "Failed",
                            message: "Send request Failed"
                        })
                    }
                } else {
                    res.status(202).json({
                        status: "Failed",
                        message: "Author cannot send to themselve"
                    })
                }
            } else {
                res.status(202).json({
                    status: "Failed",
                    message: "Not found subjectId",
                    subjectId: subjectId
                })
            }


        } catch (error) {
            console.log(error)
        }

    },
    getAllRequestSendToMe: async function (req, res, next) {
        try {
            const userEmail = req.userEmail;
            const result = await subjectRequestService.getAllRequestSendToMeByEmail(userEmail)
            if (result.length > 0) {
                res.status(200).json({
                    status: "Success",
                    listRequest: result,
                    total: result.length
                })
            } else {
                res.status(202).json({
                    status: "Failed",
                    message: "You have no request yet",
                    listRequest: [],
                    total: 0
                })
            }
        } catch (error) {
            console.log(error)
        }
    },
    approveRequest: async function (req, res, next) {
        const author = req.userEmail;
        const requestId = req.body.params.requestId;
        const requestFound = await subjectRequestService.getRequestDetailById(requestId);
        if (requestFound.length > 0) {
            if (requestFound[0].statusId === 1) {
                if (author === requestFound[0].requestTo) {
                    const approvedStatus = 2;
                    const isUpdateRequestStatus = await subjectRequestService.updateRequestStatus(requestId, approvedStatus)
                    //update
                    if (isUpdateRequestStatus === true) {
                        const isApprovedRequest = await subjectRelationAccountService.saveRelationBetweenAccountAndSubject(
                            requestFound[0].subjectId,
                            requestFound[0].requestFrom,
                            author,
                            requestFound[0].id
                        )
                        if (isApprovedRequest !== -1) {
                            res.status(200).json({
                                status: "Success",
                                message: "Approved request successfully"
                            })
                        } else {
                            res.status(202).json({
                                status: "Failed",
                                message: "Approved request failed"
                            })
                        }
                    } else {
                        console.log("update failed")
                        res.status(202).json({
                            status: "Failed",
                            message: "Approved request failed"
                        })
                    }
                } else {
                    res.status(202).json({
                        status: "Failed",
                        message: "You do not have permission to approve this request"
                    })
                }

            } else {
                res.status(202).json({
                    status: "Failed",
                    message: "Request might be approved before"
                })
            }
        } else {
            res.status(202).json({
                status: "Failed",
                message: "Not found request Id",
                requestId: requestId
            })
        }

    }

}
