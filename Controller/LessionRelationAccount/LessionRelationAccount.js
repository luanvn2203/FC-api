
const subjectRelationAccountService = require('../../service/subjectRelationAccount')
const lessionRelationAccountService = require('../../service/lessionRelationAccount')
const accountService = require('../../service/account')
const e = require('express')
module.exports = {
    checkIsAccessible: async function (req, res, next) {
        try {
            const userEmail = req.userEmail;
            const lessionId = req.body.params.lessionId
            const accountFound = await accountService.findAccountByEmail(userEmail)
            if (accountFound.length > 0) {
                const relationshipFound = await lessionRelationAccountService.getRelationByEmailAndLessionId(userEmail, lessionId)
                if (relationshipFound.length > 0) {
                    const isMinus = JSON.parse(JSON.stringify(relationshipFound[0].isMinusPoint))
                    if (isMinus.data[0] === 0) {
                        if (accountFound[0].point > 10) {
                            const isMinusSuccess = await accountService.minusPointToAccountByEmail(userEmail, 7)
                            if (isMinusSuccess === true) {
                                const setIsMinusPoint = await lessionRelationAccountService.setIsMinusPoint(1, userEmail, lessionId)
                                if (setIsMinusPoint === true) {
                                    res.status(200).json({
                                        status: "Success",
                                        message: "Approved",
                                        lessionId: lessionId
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
                            lessionId: lessionId
                        })
                    }
                } else {
                    res.status(202).json({
                        status: "Failed",
                        message: "User need to send request to author before.",
                        lessionId: lessionId
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
