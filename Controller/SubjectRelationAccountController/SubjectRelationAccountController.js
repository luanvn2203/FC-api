
const subjectRelationAccountService = require('../../service/subjectRelationAccount')
const accountService = require('../../service/account')
const e = require('express')
module.exports = {
    checkIsAccessible: async function (req, res, next) {
        try {
            const userEmail = req.userEmail;
            const subjectId = req.body.params.subjectId
            const accountFound = await accountService.findAccountByEmail(userEmail) //Kiểm tra account có tồn tại
            if (accountFound.length > 0) {
                if (accountFound[0].email !== userEmail) {
                    const relationshipFound = await subjectRelationAccountService.getRelationByEmailAndSubjectId(userEmail, subjectId) // kiểm tra xem đã từng gửi request chưa
                    if (relationshipFound.length > 0) {  //nếu đã từng gửi request cho author 
                        const isMinus = JSON.parse(JSON.stringify(relationshipFound[0].isMinusPoint))
                        if (isMinus.data[0] === 0) { // bằng không là chưa trừ
                            if (accountFound[0].point > 10) { // nếu point lớn hơn số point cần trừ 
                                const isMinusSuccess = await accountService.minusPointToAccountByEmail(userEmail, 10)
                                if (isMinusSuccess === true) {
                                    const setIsMinusPoint = await subjectRelationAccountService.setIsMinusPoint(1, userEmail, subjectId)
                                    if (setIsMinusPoint === true) {
                                        res.status(200).json({
                                            status: "Success",
                                            message: "Approved",
                                            subjectId: subjectId,
                                            user_point: (accountFound[0].point - 10)
                                        })
                                    }//
                                } else {
                                    res.status(202).json({
                                        status: "Failed",
                                        message: "Minus failed.",
                                    })
                                }
                            } else { // không đủ điểm => failed
                                res.status(202).json({
                                    status: "Point Unavailable",
                                    message: "Approved by author but user don't have enough point left.",
                                })
                            }
                        } else { //đã trừ => coi nội dung
                            res.status(200).json({
                                status: "Success",
                                message: "Approved",
                                subjectId: subjectId
                            })
                        }
                    } else { // yêu cầu gửi request
                        res.status(202).json({
                            status: "Not Found Request",
                            message: "User need to send request to author before.",
                            subjectId: subjectId
                        })
                    }
                } else { // la author 
                    res.status(200).json({
                        status: "Success",
                        message: "Approved - author",
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
