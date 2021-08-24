
const subjectRelationAccountService = require('../../service/subjectRelationAccount')
const accountService = require('../../service/account')
const pointHistoryService = require('../../service/pointHistory')
const subjectService = require('../../service/subject')
const e = require('express')
const Point = require('../../pointConfig')

const lessionService = require('../../service/lession')
module.exports = {
    checkIsAccessible: async function (req, res, next) {
        try {
            const userEmail = req.userEmail;
            const subjectId = req.body.params.subjectId
            const accountFound = await accountService.findAccountByEmail(userEmail) //Kiểm tra account có tồn tại
            const subjectFound = await subjectService.getSubjectById(subjectId)
            if (subjectFound.length > 0) {
                const totalLessonInSubject = await lessionService.countTotalLessionInASubject(subjectId)
                console.log(totalLessonInSubject[0].total)
                let PointToMinus = totalLessonInSubject[0].total * Point.point_define.private_lesson
                console.log(PointToMinus)

                if (accountFound.length > 0) {
                    if (subjectFound[0].accountId !== userEmail) {
                        const relationshipFound = await subjectRelationAccountService.getRelationByEmailAndSubjectId(userEmail, subjectId) // kiểm tra xem đã từng gửi request chưa
                        if (relationshipFound.length > 0) {  //nếu đã từng gửi request cho author 
                            const isMinus = JSON.parse(JSON.stringify(relationshipFound[0].isMinusPoint))
                            if (isMinus.data[0] === 0) { // bằng không là chưa trừ
                                if (accountFound[0].point > PointToMinus) { // nếu point lớn hơn số point cần trừ 
                                    const isMinusSuccess = await accountService.minusPointToAccountByEmail(userEmail, PointToMinus)
                                    if (isMinusSuccess === true) {
                                        const requestSubjectType = 1;
                                        const description = `${userEmail} request to see subject : ${subjectFound[0].subjectName}`
                                        const isSaveHistory = pointHistoryService.savePointHistory(userEmail, PointToMinus, requestSubjectType, description)
                                        if (isSaveHistory !== -1) {
                                            console.log("history saved")
                                        }
                                        const setIsMinusPoint = await subjectRelationAccountService.setIsMinusPoint(1, userEmail, subjectId)
                                        if (setIsMinusPoint === true) {
                                            res.status(200).json({
                                                status: "Success",
                                                message: "Approved",
                                                subjectId: subjectId,
                                                user_point: (accountFound[0].point - PointToMinus)
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
                                point_to_open: PointToMinus,
                                message: "User need to send request to author before, If you have send request, please waiting for author response",
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
            } else {
                res.status(202).json({
                    status: "Failed",
                    message: "Not found subject",
                })
            }


        } catch (error) {
            console.log(error)
        }
    },

}
