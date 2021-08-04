
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
            const relationFound = donorServiceRelationAccountService.getRelationByid(donorServiceRelationAccountId)
            if (relationFound.length > 0) {
                if (relationFound[0].accountId === userEmail) {
                    // tim trong feedback
                    const feedbackFound = await serviceFeedbackService.findFeedbackByAccountIdAndServiceRelationAccountId(userEmail, donorServiceRelationAccountId)
                    if (feedbackFound.length === 0) {
                        const isSaveFeedback = await serviceFeedbackService.saveFeedBack(donorServiceRelationAccountId, userEmail, point, content)
                        if (isSaveFeedback === true) {
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
            }

        } catch (error) {
            console.log(error)
        }
    }
}
