
const subjectRelationAccountService = require('../../service/subjectRelationAccount')
const accountService = require('../../service/account')
const pointHistoryService = require('../../service/pointHistory')
const subjectService = require('../../service/subject')
const e = require('express')
const Point = require('../../pointConfig')

const lessionService = require('../../service/lession')
const lessionPublicRelationshipService = require('../../service/lessionPublicRelationShip')

module.exports = {
    saveRecentLearningLession: async function (req, res, next) {
        try {
            const userEmail = req.userEmail
            const lessionId = req.body.params.lessionId
            const result = await lessionPublicRelationshipService.saveRelationShip(userEmail, lessionId)
            if (result === true) {
                res.status(200).json({
                    status: "Success",
                    message: "Save relation successfully"
                })
            } else {
                res.status(200).json({
                    status: "Failed",
                    message: "Save relation failed"
                })
            }
        } catch (error) {
            console.log(error)
        }
    }
}
