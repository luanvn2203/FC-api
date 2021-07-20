
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
                const relationshipFound = await subjectRelationAccountService.getRelationByEmailAndSubjectId(userEmail, subjectId)
                if (relationshipFound.length > 0) {
                    const isMinus = JSON.parse(JSON.stringify(relationshipFound[0].isMinusPoint))
                    if (isMinus.data[0] === 0) {
                        if (accountFound[0].point > 10) {
                            const isMinusSuccess = await accountService.minusPointToAccountByEmail(userEmail, 10)
                            if (isMinusSuccess === true) {
                                const setIsMinusPoint = await subjectRelationAccountService.setIsMinusPoint(1, userEmail, subjectId)
                                if (setIsMinusPoint === true) {
                                    res.status(200).json({
                                        status: "InPoint",
                                        message: "Approved",
                                        subjectId: subjectId
                                    })
                                }//
                            } else {
                                res.status(202).json({
                                    status: "Failed",
                                    message: "Minus failed.",
                                })
                            }
                        } else {
                            res.status(202).json({
                                status: "Point Unavailable",
                                message: "Approved by author but user don't have enough point left.",
                            })
                        }
                    } else {
                        res.status(200).json({
                            status: "OutPoint",
                            message: "Approved",
                            subjectId: subjectId
                        })
                    }
                } else {
                    res.status(202).json({
                        status: "Not Found Request",
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
