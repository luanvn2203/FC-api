
const advertisementService = require('../../service/advertisement')

module.exports = {
    createNewAdvertise: async function (req, res, next) {
        try {
            const signInAccount = req.signInAccount
            if (signInAccount.roleId === 3) {

                const title = req.body.params.title
                const content = req.body.params.content
                const imageLink = req.body.params.imageLink
                const startDate = req.body.params.startDate
                const endDate = req.body.params.endDate
                const target_url = req.body.params.targetUrl
                const isCreateAds = await advertisementService.createAds(title, content, imageLink, startDate, endDate, signInAccount.email, target_url)
                if (isCreateAds === true) {
                    res.status(200).json({
                        status: "Success",
                        message: "Create advertise successfully"
                    })
                } else {
                    res.status(202).json({
                        status: "Failed",
                        message: "Create advertise Failed"
                    })
                }
            } else {
                res.status(202).json({
                    status: "Failed",
                    message: "You don't have permission to create service, please update to donor role"
                })
            }
        } catch (error) {
            console.log(error)
        }
    },
    updateAdvertise: async function (req, res, next) {
        try {
            signInAccount = req.signInAccount
            if (signInAccount.roleId === 3) {
                const advertiseId = req.body.params.advertiseId
                const title = req.body.params.title
                const content = req.body.params.content
                const imageLink = req.body.params.imageLink
                const startDate = req.body.params.startDate
                const endDate = req.body.params.endDate
                const target_url = req.body.params.targetUrl
                const advertiseFound = await advertisementService.getAdvertiseById(advertiseId)
                if (advertiseFound.length > 0) {
                    if (advertiseFound[0].donorId === signInAccount.email) {

                        const isUpdateAdvertise = await advertisementService.updateAdvertise(advertiseId, title, content, imageLink, startDate, endDate, target_url)
                        if (isUpdateAdvertise === true) {
                            res.status(200).json({
                                status: "Success",
                                message: "Update advertise successfully"
                            })
                        } else {
                            res.status(202).json({
                                status: "Failed",
                                message: "Update advertise failed"
                            })
                        }
                    } else {
                        res.status(202).json({
                            status: "Failed",
                            message: "No permission, you are not author:  " + signInAccount.email
                        })
                    }
                } else {
                    res.status(202).json({
                        status: "Failed",
                        message: "Not found ads ID : " + advertiseId
                    })
                }


            } else {
                res.status(202).json({
                    status: "Failed",
                    message: "You don't have permission to create service, please update to donor role"
                })
            }

        } catch (error) {
            console.log(error)
        }
    },

    deleteAdvertise: async function (req, res, next) {
        try {
            signInAccount = req.signInAccount
            if (signInAccount.roleId === 3) {
                const advertiseId = req.body.params.advertiseId
                const deleteStatus = 5
                const advertiseFound = await advertisementService.getAdvertiseById(advertiseId)
                if (advertiseFound.length > 0) {
                    if (advertiseFound[0].donorId === signInAccount.email) {
                        const isDeleteAdvertise = await advertisementService.updateAdvertiseStatus(advertiseId, deleteStatus)
                        if (isDeleteAdvertise === true) {
                            res.status(202).json({
                                status: "Success",
                                message: "Delete success advertiseId : " + advertiseId
                            })
                        } else {
                            res.status(202).json({
                                status: "Failed",
                                message: "Delete failed"
                            })
                        }
                    } else {
                        res.status(202).json({
                            status: "Failed",
                            message: "No permission, you are not author:  " + signInAccount.email
                        })
                    }
                } else {
                    res.status(202).json({
                        status: "Failed",
                        message: "Not found ads ID : " + advertiseId
                    })
                }


            } else {
                res.status(202).json({
                    status: "Failed",
                    message: "You don't have permission to create service, please update to donor role"
                })
            }

        } catch (error) {
            console.log(error)
        }
    },
    getAllAdvertiseByMe: async function (req, res, next) {
        try {
            signInAccount = req.signInAccount
            if (signInAccount.roleId === 3) {
                const listAdsFound = await advertisementService.getAllAdvertiseByEmail(signInAccount.email)
                if (listAdsFound.length > 0) {
                    res.status(202).json({
                        status: "Success",
                        listAds: listAdsFound,
                        total: listAdsFound.length
                    })
                } else {
                    res.status(202).json({
                        status: "Failed",
                        listAds: listAdsFound,
                        total: listAdsFound.length
                    })
                }
            } else {
                res.status(202).json({
                    status: "Failed",
                    message: "You don't have permission to create service, please update to donor role"
                })
            }
        } catch (error) {
            console.log(error)
        }
    },
    getAllAdvertiseForAdminManagement: async function (req, res, next) {
        try {
            signInAccount = req.signInAccount
            if (signInAccount.roleId === 2) {
                const listAdsFound = await advertisementService.getAllAdvertiseByAdmin();
                if (listAdsFound.length > 0) {
                    res.status(200).json({
                        status: "Success",
                        listAds: listAdsFound,
                        total: listAdsFound.length
                    })
                } else {
                    res.status(200).json({
                        status: "Failed",
                        listAds: listAdsFound,
                        total: listAdsFound.length
                    })
                }
            } else {
                res.status(202).json({
                    status: "Failed",
                    message: "You don't have permission"
                })
            }
        } catch (error) {
            console.log(error)
        }
    }
}
