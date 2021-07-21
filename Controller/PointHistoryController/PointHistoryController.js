
const { db } = require('../../config')
const pointHistoryService = require('../../service/pointHistory')
module.exports = {
    getMyAllPointHistory: async function (req, res, next) {
        try {
            const sortType = 'desc'
            const email = req.userEmail
            const result = await pointHistoryService.getAllPointHistoryByEmail(email, sortType)
            if (result.length > 0) {
                res.status(200).json({
                    status: 'Success',
                    listHistory: result,
                    total: result.length
                })
            } else {
                res.status(202).json({
                    status: 'Failed',
                    listHistory: result,
                    total: result.length
                })
            }
        } catch (error) {
            console.log(error)
        }
    }
}
