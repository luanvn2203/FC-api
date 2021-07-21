
const subjectRelationAccountService = require('../../service/subjectRelationAccount')
const lessionRelationAccountService = require('../../service/lessionRelationAccount')
const accountService = require('../../service/account')
const lessionService = require('../../service/lession')
const subjectService = require('../../service/subject')
const pointHistoryService = require('../../service/pointHistory')

const Point = require('../../pointConfig')

const e = require('express')
module.exports = {
    checkIsAccessible: async function (req, res, next) {
        try {
            const userEmail = req.userEmail;
            const lessionId = req.body.params.lessionId
            const lessionFound = await lessionService.getLessionByLessionId(lessionId)
            if (lessionFound.length > 0) { // lay lession info
                // subjectID 
                const subjectFound = await subjectService.getSubjectById(lessionFound[0].subjectId)
                if (subjectFound.length > 0) {
                    if (subjectFound[0].statusId === 2) {// neu la subject private => check
                        const relationFound = await subjectRelationAccountService.getRelationByEmailAndSubjectId(userEmail, lessionFound[0].subjectId)
                        if (relationFound.length > 0) {
                            // da duoc approved => xem duoc tat ca lession 
                            res.status(200).json({
                                status: "Success",
                                message: "Approved - subject approved before",
                            })

                        } else {
                            //subject la private nhung ma khong tim thay relation cuar subject
                            res.status(202).json({
                                status: "Failed",
                                message: "Subject is private but user does not send request before to see all lession",
                            })
                        }
                    } else { // public status => check
                        const accountFound = await accountService.findAccountByEmail(userEmail)
                        if (accountFound.length > 0) {
                            if (lessionFound[0].accountId !== userEmail) {
                                const relationshipFound = await lessionRelationAccountService.getRelationByEmailAndLessionId(userEmail, lessionId)
                                if (relationshipFound.length > 0) {
                                    const isMinus = JSON.parse(JSON.stringify(relationshipFound[0].isMinusPoint))
                                    if (isMinus.data[0] === 0) {
                                        if (accountFound[0].point > Point.point_minus.lession_request_point_minus) {
                                            const isMinusSuccess = await accountService.minusPointToAccountByEmail(userEmail, Point.point_minus.lession_request_point_minus)
                                            if (isMinusSuccess === true) {
                                                const requestLessionType = 2;
                                                const description = `${userEmail} request to see lession : ${lessionFound[0].lessionName}`
                                                const isSaveHistory = pointHistoryService.savePointHistory(userEmail, Point.point_minus.lession_request_point_minus, requestLessionType, description)
                                                if (isSaveHistory !== -1) {
                                                    console.log("history saved")
                                                }
                                                const setIsMinusPoint = await lessionRelationAccountService.setIsMinusPoint(1, userEmail, lessionId)
                                                if (setIsMinusPoint === true) {
                                                    res.status(200).json({
                                                        status: "Success",
                                                        message: "Approved",
                                                        lessionId: lessionId,
                                                        user_point: (accountFound[0].point - Point.point_minus.lession_request_point_minus)
                                                    })
                                                }
                                            } else {
                                                res.status(202).json({
                                                    status: "Point Unavailable",
                                                    message: "Approved by author but user don't have enough point left.",
                                                })
                                            }
                                        } else {
                                            res.status(202).json({
                                                status: "Failed",
                                                message: "Approved by author but user don't have enough point left.",
                                            })
                                        }
                                    } else {
                                        res.status(200).json({
                                            status: "Success",
                                            message: "Approved",
                                            lessionId: lessionId
                                        })
                                    }
                                } else {
                                    res.status(202).json({
                                        status: "Not Found Request",
                                        message: "User need to send request to author before.",
                                        lessionId: lessionId
                                    })
                                }
                            } else {
                                res.status(200).json({
                                    status: "Success",
                                    message: "Approved-author",
                                })
                            }
                        } else {
                            res.status(202).json({
                                status: "Failed",
                                message: "Unauthorize",
                            })
                        }
                    }
                } else {
                    //not found subject
                    res.status(202).json({
                        status: "Failed",
                        message: "Not found subject ID",
                        lessionId: lessionId
                    })
                }









                ///////////////////////////

            } else {
                res.status(202).json({
                    status: "Failed",
                    message: "Not Found Lession ID",
                })
            }



        } catch (error) {
            console.log(error)
        }
    }

}
