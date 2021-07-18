
const subjectRequestService = require('../../service/subjectRequestService')
const subjectService = require('../../service/subject')
const subjectRelationAccountService = require('../../service/subjectRelationAccount')
const accountService = require('../../service/account')
const e = require('express')
module.exports = {
    checkIsAccessible: async function (req, res, next) {
        try {
            const userEmail = req.userEmail;
            const subjectId = req.body.params.subjectId
            const accountFound = await accountService.findAccountByEmail(userEmail)
            if (accountFound.length > 0) {
                console.log(accountFound[0])
                const relationshipFound = await subjectRelationAccountService.getRelationByEmailAndSubjectId(userEmail, subjectId)
                if (relationshipFound.length > 0) {
                    const isMinus = JSON.parse(JSON.stringify(relationshipFound[0].isMinusPoint))
                    if (isMinus.data[0] === 0) {
                        if (accountFound[0].point > 10) {
                            const isMinusSuccess = await accountService.minusPointToAccountByEmail(userEmail, 10)
                            console.log(isMinusSuccess)
                            if (isMinusSuccess === true) {
                                const setIsMinusPoint = await subjectRelationAccountService.setIsMinusPoint(1, userEmail, subjectId)
                                if (setIsMinusPoint === true) {
                                    res.status(200).json({
                                        status: "Success",
                                        message: "Approved",
                                        subjectId: subjectId
                                    })
                                }
                            } else {
                                res.status(202).json({
                                    status: "Failed",
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
                            subjectId: subjectId
                        })
                    }
                } else {
                    res.status(202).json({
                        status: "Failed",
                        message: "User need to send request to author before.",
                        subjectId: subjectId
                    })
                }
            } else {
                res.status(202).json({
                    status: "Failed",
                    message: "Unauthorize",
                })
            }

        } catch (error) {
            console.log(error)
        }
    }

}
