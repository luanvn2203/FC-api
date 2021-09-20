
const subjectRequestService = require('../../service/subjectRequestService')
const subjectService = require('../../service/subject')
const subjectRelationAccountService = require('../../service/subjectRelationAccount')
const accountService = require('../../service/account')
const lessionService = require('../../service/lession')
const lessionRequestService = require('../../service/lessionRequestService')
const lessionRelationAccountService = require('../../service/lessionRelationAccount')
const pointHistoryService = require('../../service/pointHistory')
const Point = require('../../pointConfig')
const mailer = require('../../mailer')

module.exports = {
    sendViewLessionRequest: async function (req, res, next) {
        try {
            const requestedAccount = req.userEmail.trim();
            const lessionId = req.body.params.lessionId;
            const lessionFound = await lessionService.getLessionByLessionId(lessionId)
            if (lessionFound.length > 0) {
                const subjectFound = await subjectService.getSubjectById(lessionFound[0].subjectId)

                const waittingStatus = 1;
                if (lessionFound[0].accountId !== requestedAccount) {
                    const isExistedRequest = await lessionRequestService.checkDuplicateRequest(lessionFound[0].lessionId, requestedAccount, lessionFound[0].accountId)
                    if (!isExistedRequest.length > 0) {
                        const result = await lessionRequestService.saveRequest(requestedAccount, lessionFound[0].accountId, lessionId, waittingStatus, lessionFound[0].subjectId)
                        if (result === true) {
                            //send mail
                            let subject = `You has new request from FC system`;
                            let body = `
                            <p>Hi there,</p>
                            <p>${requestedAccount} has send you a request to view the lesson <b> ${lessionFound[0].lessionName} </b> in subject <b>${subjectFound[0].subjectName} </b> </h2>
                            <p>You can visit the website to do the action with the request</h3>
                            <hr/>
                            <p>Do not reply this email. Thank you !</h4>
                             `
                            //sendEmail
                            await mailer.sendMail(subjectFound[0].accountId, subject, body).catch(error => {
                                console.log(error.message)
                            })


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
                    message: "Not found lessionId",
                    lessionId: lessionId
                })
            }


        } catch (error) {
            console.log(error)
        }

    },
    getAllRequestSendToMe: async function (req, res, next) {
        try {
            const userEmail = req.userEmail;
            const result = await lessionRequestService.getAllRequestSendToMeByEmail(userEmail)
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
        const requestFound = await lessionRequestService.getRequestDetailById(requestId);
        if (requestFound.length > 0) {
            const lessionFound = await lessionService.getLessionByLessionId(requestFound[0].lessionId)
            if (requestFound[0].statusId === 1) {
                if (author === requestFound[0].requestTo) {
                    const approvedStatus = 2;
                    const isUpdateRequestStatus = await lessionRequestService.updateRequestStatus(requestId, approvedStatus)
                    //xong toi day
                    //update
                    if (isUpdateRequestStatus === true) {

                        const isApprovedRequest = await lessionRelationAccountService.saveRelationBetweenAccountAndLession(
                            requestFound[0].lessionId,
                            requestFound[0].requestFrom,
                            author,
                            requestFound[0].id
                        )
                        if (isApprovedRequest !== -1) {

                            const totalJoin = await subjectService.getTotalJoinSubjectByAuthorId(author)
                            const famousRate = Point.PointRate.initialRate + (Point.PointRate.one_level_rate * Math.trunc(totalJoin[0].total / Point.JoinTimesToIncreaseRateLevel))
                            if (famousRate < 1) {
                                const pointAdd = Point.point_define.private_lesson * 0.5
                                const isAddPoint = await accountService.addPointToAccountByEmail(author, pointAdd)
                                if (isAddPoint === true) {
                                    const author_approved_lession = 4;
                                    const description = `${author} approved request with ID : ${requestFound[0].lessionId} from ${requestFound[0].requestFrom} `
                                    const isSaveHistory = pointHistoryService.savePointHistory(author, pointAdd, author_approved_lession, description)
                                    if (isSaveHistory !== -1) {
                                        console.log("history saved")
                                    }

                                    //send mail
                                    let subject = `Your request has approved by author in FC system`;
                                    let body = `
                                <p>Hi there,</p>
                                <p>The author has approved your request to view the lesson <b>${lessionFound[0].lessionName}</b></h2>
                                <p>You can visit the website for learning now! </h3>
                                <hr/>
                                <p>Do not reply this email. Thank you !</h4>
                                `
                                    //sendEmail
                                    await mailer.sendMail(requestFound[0].requestFrom, subject, body).catch(error => {
                                        console.log(error.message)
                                    })


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
                            } else if (famousRate >= 1 && famousRate < 1.5) {
                                const pointAdd = Point.point_define.private_lesson * 1
                                const isAddPoint = await accountService.addPointToAccountByEmail(author, pointAdd)
                                if (isAddPoint === true) {
                                    const author_approved_lession = 4;
                                    const description = `${author} approved request with ID : ${requestFound[0].lessionId} from ${requestFound[0].requestFrom} `
                                    const isSaveHistory = pointHistoryService.savePointHistory(author, pointAdd, author_approved_lession, description)
                                    if (isSaveHistory !== -1) {
                                        console.log("history saved")
                                    }

                                    //send mail
                                    let subject = `Your request has approved by author in FC system`;
                                    let body = `
                                <p>Hi there,</p>
                                <p>The author has approved your request to view the lesson <b>${lessionFound[0].lessionName}</b></h2>
                                <p>You can visit the website for learning now! </h3>
                                <hr/>
                                <p>Do not reply this email. Thank you !</h4>
                                `
                                    //sendEmail
                                    await mailer.sendMail(requestFound[0].requestFrom, subject, body).catch(error => {
                                        console.log(error.message)
                                    })


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
                            } else if (famousRate >= 1.5) {
                                const pointAdd = Point.point_define.private_lesson * 1.5
                                const isAddPoint = await accountService.addPointToAccountByEmail(author, pointAdd)
                                if (isAddPoint === true) {
                                    const author_approved_lession = 4;
                                    const description = `${author} approved request with ID : ${requestFound[0].lessionId} from ${requestFound[0].requestFrom} `
                                    const isSaveHistory = pointHistoryService.savePointHistory(author, pointAdd, author_approved_lession, description)
                                    if (isSaveHistory !== -1) {
                                        console.log("history saved")
                                    }

                                    //send mail
                                    let subject = `Your request has approved by author in FC system`;
                                    let body = `
                                <p>Hi there,</p>
                                <p>The author has approved your request to view the lesson <b>${lessionFound[0].lessionName}</b></h2>
                                <p>You can visit the website for learning now! </h3>
                                <hr/>
                                <p>Do not reply this email. Thank you !</h4>
                                `
                                    //sendEmail
                                    await mailer.sendMail(requestFound[0].requestFrom, subject, body).catch(error => {
                                        console.log(error.message)
                                    })


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
                            }

                            //cong diem


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
        const requestFound = await lessionRequestService.getRequestDetailById(requestId);
        if (requestFound.length > 0) {
            if (requestFound[0].statusId === 1) {
                if (author === requestFound[0].requestTo) {
                    const denineStatus = 3
                    const isUpdateRequestStatus = await lessionRequestService.updateRequestStatus(requestId, denineStatus)
                    if (isUpdateRequestStatus === true) {
                        res.status(200).json({
                            status: "Success",
                            message: "Denine request successfully"
                        })
                    } else {
                        console.log("update failed")
                        res.status(202).json({
                            status: "Failed",
                            message: "Denine request failed"
                        })
                    }
                } else {
                    res.status(202).json({
                        status: "Failed",
                        message: "You do not have permission to denine this request"
                    })
                }

            } else {
                res.status(202).json({
                    status: "Failed",
                    message: "Request might be denine or denine before"
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
            const userEmail = req.userEmail;
            const result = await lessionRequestService.getAllRequestSendFromByEmail(userEmail)
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
    cancelRequest: async function (req, res, next) {
        try {
            const userEmail = req.userEmail;
            const requestId = req.body.params.requestId;
            const requestFound = await lessionRequestService.getRequestDetailById(requestId)
            if (requestFound.length > 0) {
                if (requestFound[0].requestFrom === userEmail) {
                    // update status
                    if (requestFound[0].statusId === 1) {
                        const cancelStatus = 5
                        const isCancelSuccess = await lessionRequestService.updateRequestStatus(requestId, cancelStatus)
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
