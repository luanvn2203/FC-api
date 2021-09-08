
const uuidv4 = require('uuid')
const serviceFeedbackService = require('../../service/serviceFeedBack')
const donorServiceRelationAccountService = require('../../service/donorServiceRelationAccount')

module.exports = {
    saveFeedback: async function (req, res, next) {
        try {
            const userEmail = req.userEmail
            const donorServiceRelationAccountId = req.body.params.donorServiceRelationAccountId
            const point = req.body.params.point
            const content = req.body.params.content
            //chua check author relation
            const relationFound = await donorServiceRelationAccountService.getRelationByid(donorServiceRelationAccountId)
            console.log(relationFound)
            if (relationFound.length > 0) {
                if (relationFound[0].accountId === userEmail) {
                    // tim trong feedback
                    const feedbackFound = await serviceFeedbackService.findFeedbackByAccountIdAndServiceRelationAccountId(userEmail, donorServiceRelationAccountId)
                    if (feedbackFound.length === 0) {
                        const isSaveFeedback = await serviceFeedbackService.saveFeedBack(donorServiceRelationAccountId, userEmail, point, content)
                        if (isSaveFeedback === true) {
                            // update feedback status
                            await donorServiceRelationAccountService.updateIsFeedBack(donorServiceRelationAccountId, 1)
                            res.status(200).json({
                                status: "Success",
                                message: "Send feedback successfully"
                            })
                        } else {
                            res.status(200).json({
                                status: "Failed",
                                message: "Send feedback failed"
                            })
                        }
                    } else {
                        res.status(200).json({
                            status: "Failed",
                            message: "You have already send feed back for this product"
                        })
                    }


                } else {
                    res.status(200).json({
                        status: "Failed",
                        message: "No permission"
                    })
                }
            } else {
                res.status(200).json({
                    status: "Failed",
                    message: "Not found history ID: " + donorServiceRelationAccountId
                })
            }
        } catch (error) {
            console.log(error)
        }
    },

    viewFeedbackForAdminRole: async function (req, res, next) {
        try {
            const signInAccount = req.signInAccount
            if (signInAccount.roleId === 2) {
                const result = await serviceFeedbackService.viewAllFeedbackForAdmin()
                if (result.length > 0) {
                    res.status(200).json({
                        status: "Success",
                        listFeedback: result,
                        total: result.length

                    })
                } else {
                    res.status(202).json({
                        status: "Failed",
                        listFeedback: result,
                        total: result.length
                    })
                }

            } else {
                res.status(202).json({
                    status: "Failed",
                    message: "No permission"
                })
            }


        } catch (error) {
            console.log(error)
        }
    }
}
