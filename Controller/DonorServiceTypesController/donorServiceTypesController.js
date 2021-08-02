
const { sign } = require('jsonwebtoken');
const donorServiceTypesService = require('../../service/donorServiceTypesService')

module.exports = {
    getAllServiceTypes: async function (req, res, next) {
        try {
            signInAccount = req.signInAccount
            if (signInAccount.roleId === 3) {
                const result = await donorServiceTypesService.getAllTServiceType();
                if (result.length > 0) {
                    res.status(200).json({
                        status: "Success",
                        types: result,
                        total: result.length
                    })
                } else {
                    res.status(202).json({
                        status: "Failed",
                        types: result,
                        total: result.length,
                        message: "No type found in DB"
                    })
                }
            } else {
                res.status(202).json({
                    status: "Failed",
                    message: "You don't have permission , please update to donor role"
                })
            }



        } catch (error) {
            console.log(error)
        }
    }
}
