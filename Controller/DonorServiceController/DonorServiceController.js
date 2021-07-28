
const { sign } = require('jsonwebtoken');
const donorServiceService = require('../../service/donorServiceService')

module.exports = {
    createService: async function (req, res, next) {
        try {
            const serviceInfor = req.body;
            signInAccount = req.signInAccount
            if (signInAccount.roleId === 3) {
                const isCreateService = await donorServiceService.createNewService(serviceInfor, signInAccount.email)
                console.log(isCreateService)
                if (isCreateService === true) {
                    res.status(200).json({
                        status: "Success",
                        message: "Create service successfully",
                        service: serviceInfor.params
                    })
                } else {
                    res.status(202).json({
                        status: "Failed",
                        message: "Create service failed"
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
    updateService: async function (req, res, next) {
        try {
            const serviceInfor = req.body.params;
            signInAccount = req.signInAccount
            if (signInAccount.roleId === 3) {
                const serviceFound = await donorServiceService.getServiceById(serviceInfor.serviceId)
                if (serviceFound.length > 0) {
                    if (serviceFound[0].donorId === signInAccount.email) {
                        const isUpdate = await donorServiceService.updateServiceInformation(serviceInfor, signInAccount.email)
                        if (isUpdate === true) {
                            res.status(200).json({
                                status: "Success",
                                message: "Update service successfully",
                            })
                        } else {
                            res.status(202).json({
                                status: "Failed",
                                message: "Update service failed"
                            })
                        }
                    } else {
                        res.status(202).json({
                            status: "Failed",
                            message: "Update failed, you are not author"
                        })
                    }
                } else {
                    res.status(202).json({
                        status: "Failed",
                        message: "Not found service ID"
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
    deleteService: async function (req, res, next) {
        try {
            const serviceId = req.body.params.serviceId;
            signInAccount = req.signInAccount
            if (signInAccount.roleId === 3) {
                const serviceFound = await donorServiceService.getServiceById(serviceId)
                if (serviceFound.length > 0) {
                    if (serviceFound[0].donorId === signInAccount.email) {
                        const deleteStatus = 3;
                        const isDelete = await donorServiceService.updateServiceStatus(serviceId, deleteStatus)
                        if (isDelete === true) {
                            res.status(200).json({
                                status: "Failed",
                                message: "Delete successfully",
                                serviceId: serviceId
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
                            message: "Delete failed, you are not author"
                        })
                    }
                } else {
                    res.status(202).json({
                        status: "Failed",
                        message: "Not found service ID"
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
    getAllServiceByMe: async function (req, res, next) {
        try {
            signInAccount = req.signInAccount
            if (signInAccount.roleId === 3) {
                const listServiceFound = await donorServiceService.getAllServiceByEmail(signInAccount.email)
                if (listServiceFound.length > 0) {
                    res.status(200).json({
                        status: "Success",
                        listService: listServiceFound,
                        total: listServiceFound.length
                    })
                } else {
                    res.status(202).json({
                        status: "Failed",
                        listService: listServiceFound,
                        total: listServiceFound.length
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
    }
}
