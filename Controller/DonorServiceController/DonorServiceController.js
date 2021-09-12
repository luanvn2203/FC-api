
const { sign } = require('jsonwebtoken');
const donorServiceService = require('../../service/donorServiceService')
const serviceDetailService = require('../../service/serviceDetail')
const uuidv4 = require('uuid');
const { db } = require('../../config');
module.exports = {
    createService: async function (req, res, next) {
        try {
            const signInAccount = req.signInAccount
            if (signInAccount.roleId === 3) {
                const serviceTypeId = req.body.params.serviceTypeId
                const serviceName = req.body.params.serviceName
                const serviceInformation = req.body.params.serviceInformation
                const quantity = req.body.params.quantity
                const detail = req.body.params.detail
                if (serviceTypeId === 3) {
                    // hien vat
                    let current = new Date();
                    let cDate = current.getFullYear() + '-' + (current.getMonth() + 1) + '-' + current.getDate();
                    let cTime = current.getHours() + ":" + current.getMinutes() + ":" + current.getSeconds();
                    let dateTime = cDate + ' ' + cTime;
                    const isCreateService = await donorServiceService.createNewService(
                        signInAccount.email,
                        serviceTypeId,
                        serviceName,
                        serviceInformation,
                        quantity,
                        0
                    );
                    console.log(isCreateService)
                    if (isCreateService !== -1 && isCreateService >= 0) {
                        // const ErrorObj = []
                        // for 
                        // for (let qindex = 0; qindex < quantity; qindex++) {
                        //     console.log("ahhiii")
                        const isSaveDetail = await serviceDetailService.saveServiceDetail(
                            isCreateService,
                            serviceName,
                            dateTime,
                            dateTime,
                            quantity
                        );
                        if (isSaveDetail === true) {
                            res.status(200).json({
                                status: "Success",
                                message: "Create service successfully",
                            })
                        } else {
                            res.status(202).json({
                                status: "Failed",
                                message: "Create service failed",
                                failed: ErrorObj
                            })
                        }
                        // }
                        // if (ErrorObj.length === 0) {
                        //     res.status(200).json({
                        //         status: "Success",
                        //         message: "Create service successfully",
                        //     })
                        // } else {
                        //     const deleteService = donorServiceService.updateServiceStatus(isCreateService, 3)
                        //     res.status(202).json({
                        //         status: "Failed",
                        //         message: "Create service failed",
                        //         failed: ErrorObj
                        //     })
                        // }
                    } else {
                        res.status(202).json({
                            status: "Failed",
                            message: "Create service failed"
                        })
                    }
                } else {
                    // code - co detail
                    const isCreateService = await donorServiceService.createNewService(
                        signInAccount.email,
                        serviceTypeId,
                        serviceName,
                        serviceInformation,
                        quantity,
                        1
                    );
                    console.log(isCreateService)
                    if (isCreateService !== -1 && isCreateService >= 0) {
                        // save detail
                        const ErrorObj = []
                        if (detail.length > 0) {
                            for (let index = 0; index < detail.length; index++) {
                                const isSaveDetail = await serviceDetailService.saveServiceDetail(
                                    isCreateService,
                                    detail[index].serviceContent,
                                    detail[index].startDate,
                                    detail[index].endDate,
                                    1
                                );
                                if (isSaveDetail === true) {

                                } else {
                                    ErrorObj.push(detail[index])
                                }
                            }
                        }
                        if (ErrorObj.length === 0) {
                            res.status(200).json({
                                status: "Success",
                                message: "Create service successfully",
                            })
                        } else {
                            const deleteService = donorServiceService.updateServiceStatus(isCreateService, 3)
                            res.status(202).json({
                                status: "Failed",
                                message: "Create service failed",
                                failed: ErrorObj
                            })
                        }

                    } else {
                        res.status(202).json({
                            status: "Failed",
                            message: "Create service failed"
                        })
                    }
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
                        const deleteDetail = await serviceDetailService.updateDetailStatusByServiceId(serviceFound[0].id, deleteStatus)
                        if (deleteDetail === true) {
                            const isDelete = await donorServiceService.updateServiceStatus(serviceId, deleteStatus)
                            if (isDelete === true) {
                                res.status(200).json({
                                    status: "Success",
                                    message: "Delete successfully",
                                    serviceId: serviceId
                                })
                            } else {
                                res.status(202).json({
                                    status: "Failed",
                                    message: "Delete failed"
                                })
                            }
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
                    for (let index = 0; index < listServiceFound.length; index++) {
                        const serviceDetailFound = await serviceDetailService.getAllDetailByServiceId(listServiceFound[index].id)
                        listServiceFound[index].detail = serviceDetailFound
                    }
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
    },

    confirmByAdmin: async function (req, res, next) {
        try {
            const signInAccount = req.signInAccount
            if (signInAccount.roleId === 2) {
                const isConfirm = req.body.params.isConfirm
                const serviceId = req.body.params.serviceId
                const quantity = req.body.params.quantity

                const serviceFound = await donorServiceService.getServiceById(serviceId)
                if (serviceFound.length > 0) {
                    if (quantity <= serviceFound[0].quantity) {
                        if (isConfirm === true || isConfirm === false) {
                            const result = await donorServiceService.confirmByAdmin(serviceId, isConfirm, quantity)
                            if (result === true) {
                                res.status(202).json({
                                    status: "Failed",
                                    message: "Change confirmation successfully"
                                })
                            } else {
                                res.status(202).json({
                                    status: "Failed",
                                    message: "Confirm failed with 276 donorservicecontroller"
                                })
                            }
                        } else {
                            res.status(202).json({
                                status: "Failed",
                                message: "Wrong confirmation status or quantity"
                            })
                        }
                    } else {
                        res.status(202).json({
                            status: "Failed",
                            message: "Wrong quantity or confirmation status"
                        })
                    }




                } else {
                    res.status(202).json({
                        status: "Failed",
                        message: "ServiceID not found"
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
    },
    getAllForAdminView: async function (req, res, next) {
        try {
            const signInAccount = req.signInAccount
            if (signInAccount.roleId === 2) {
                const result = await donorServiceService.getAllServiceOrderByDate()
                if (result.length > 0) {
                    res.status(200).json({
                        status: "Success",
                        listService: result,
                        total: result.length
                    })
                } else {
                    res.status(202).json({
                        status: "Failed",
                        listService: result,
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
