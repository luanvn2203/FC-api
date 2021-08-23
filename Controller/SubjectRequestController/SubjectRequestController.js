
const subjectRequestService = require('../../service/subjectRequestService')
const subjectService = require('../../service/subject')
const subjectRelationAccountService = require('../../service/subjectRelationAccount')
const accountService = require('../../service/account')
const pointHistoryService = require('../../service/pointHistory')
const Point = require('../../pointConfig')

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
                    // check requet is existed
                    const isExistedRequest = await subjectRequestService.checkDuplicateRequest(subjectFound[0].subjectId, requestedAccount, subjectFound[0].accountId)
                    if (!isExistedRequest.length > 0) {
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
                            message: "Request have send before, please wait response from author"
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
        console.log(requestId)
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
                            //cong diem
                            const isAddPoint = await accountService.addPointToAccountByEmail(author, 1)
                            if (isAddPoint === true) {
                                const author_approved_subject = 3;
                                const description = `${author} approved request with ID : ${requestFound[0].subjectId} from ${requestFound[0].requestFrom} `
                                const isSaveHistory = pointHistoryService.savePointHistory(author, Point.point_add.author_approved_subject, author_approved_subject, description)
                                if (isSaveHistory !== -1) {
                                    console.log("history saved")
                                }
                                res.status(200).json({
                                    status: "Success",
                                    message: "Approved request successfully"
                                })
                            } else {
                                res.status(202).json({
                                    status: "Failed",
                                    message: "Approved request successfully but add point failed"
                                })
                            }

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
                    message: "Request might be approved or denine before"
                })
            }
        } else {
            res.status(202).json({
                status: "Failed",
                message: "Not found request Id",
                requestId: requestId
            })
        }

    },
    denineRequest: async function (req, res, next) {
        const author = req.userEmail;
        const requestId = req.body.params.requestId;
        const requestFound = await subjectRequestService.getRequestDetailById(requestId);
        if (requestFound.length > 0) {
            if (requestFound[0].statusId === 1) {
                if (author === requestFound[0].requestTo) {
                    const denineStatus = 3
                    const isUpdateRequestStatus = await subjectRequestService.updateRequestStatus(requestId, denineStatus)
                    //update
                    if (isUpdateRequestStatus === true) {

                        res.status(200).json({
                            status: "Success",
                            message: "Approved request successfully"
                        })
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
                    message: "Request might be approved or denine before"
                })
            }
        } else {
            res.status(202).json({
                status: "Failed",
                message: "Not found request Id",
                requestId: requestId
            })
        }
    },
    getAllRequestSendFromMe: async function (req, res, next) {
        try {
            const userEmail = req.userEmail
            const result = await subjectRequestService.getAllRequestSendFromEmail(userEmail)
            if (result.length > 0) {
                res.status(200).json({
                    status: "Success",
                    listRequest: result,
                    total: result.length
                })
            } else {
                res.status(200).json({
                    status: "Failed",
                    listRequest: result,
                    total: result.length
                })
            }
        } catch (error) {
            console.log(error)
        }
    },
    cancelRequest: async function (req, res, next) {
        try {
            const userEmail = req.userEmail;
            const requestId = req.body.params.requestId;
            const requestFound = await subjectRequestService.getRequestDetailById(requestId)
            if (requestFound.length > 0) {
                if (requestFound[0].requestFrom === userEmail) {
                    // update status
                    if (requestFound[0].statusId === 1) {
                        const cancelStatus = 5
                        const isCancelSuccess = await subjectRequestService.updateRequestStatus(requestId, cancelStatus)
                        if (isCancelSuccess === true) {
                            res.status(200).json({
                                status: "Success",
                                message: "Cancel request successfully"
                            })
                        } else {
                            res.status(202).json({
                                status: "Failed",
                                message: "Cancel failed"
                            })
                        }
                    } else if (requestFound[0].statusId === 5) {
                        res.status(202).json({
                            status: "Failed",
                            message: "Request have been cancel before"
                        })
                    } else {
                        res.status(202).json({
                            status: "Failed",
                            message: "Request is not waiting, cannot cancel"
                        })
                    }
                } else {
                    res.status(202).json({
                        status: "Failed",
                        message: "Not your request"
                    })
                }
            } else {
                res.status(202).json({
                    status: "Failed",
                    message: "Not found request ID"
                })
            }

        } catch (error) {
            console.log(error)
        }
    }

}
