
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
                const target_url = req.body.params.target_url
                const expected_using_point = req.body.params.expected_using_point
                const time_rendering = expected_using_point * 10
                const isCreateAds = await advertisementService.createAds(title, content, imageLink, startDate, endDate, signInAccount.email, target_url, expected_using_point, time_rendering)
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
                const target_url = req.body.params.target_url
                const expected_using_point = req.body.params.expected_using_point
                const time_rendering = expected_using_point * 10

                console.log(expected_using_point)
                const advertiseFound = await advertisementService.getAdvertiseById(advertiseId)
                if (advertiseFound.length > 0) {
                    if (advertiseFound[0].donorId === signInAccount.email) {
                        const isUpdateAdvertise = await advertisementService.updateAdvertise(advertiseId, title, content, imageLink, startDate, endDate, target_url, expected_using_point, time_rendering)
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
                const deleteStatus = 4
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
    },

    approveRunningAdsByAdmin: async function (req, res, next) {
        try {
            const signInAccount = req.signInAccount
            const advertiseId = req.body.params.advertiseId
            console.log(advertiseId)
            if (signInAccount.roleId === 2) {
                const advertiseFound = await advertisementService.getAdvertiseById(advertiseId)
                if (advertiseFound.length > 0) {
                    if (advertiseFound[0].statusId === 1) {
                        const runningStatus = 2;
                        const changeStatus = await advertisementService.updateAdvertiseStatus(advertiseId, runningStatus)
                        if (changeStatus === true) {
                            res.status(202).json({
                                status: "Success",
                                message: "Run the advertise successfully."
                            })
                        } else {
                            res.status(202).json({
                                status: "Failed",
                                message: "Run the advertise failed"
                            })
                        }
                    } else {
                        res.status(202).json({
                            status: "Failed",
                            message: "Add is running or expired, please check again"
                        })
                    }
                } else {
                    res.status(202).json({
                        status: "Failed",
                        message: "Not found ads"
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

    getAdvertiseForCurrentRendering: async function (req, res, next) {
        try {
            const runningAdsFound = await advertisementService.adsForRendering()
            if (runningAdsFound.length > 0) {
                if (runningAdsFound[0].time_rendering > 0) {
                    await advertisementService.updateTimeRendering(runningAdsFound[0].id, 1, true)
                    if (runningAdsFound[0].time_rendering === 1) {
                        const stoppedStatus = 3;
                        await advertisementService.updateAdvertiseStatus(runningAdsFound[0].id, stoppedStatus)
                    }
                    res.status(200).json({
                        status: "Success",
                        advertiseInfo: runningAdsFound[0]
                    })
                } else {
                    const stoppedStatus = 3;
                    await advertisementService.updateAdvertiseStatus(runningAdsFound[0].id, stoppedStatus)
                    res.status(200).json({
                        status: "Failed",
                        message: " No available advertise now."
                    })
                }
            } else {
                res.status(202).json({
                    status: "Failed",
                    message: " No available advertise now."
                })
            }
        } catch (error) {
            console.log(error)
        }
    },
    removeAdsByAdmin: async function (req, res, next) {
        try {
            const signInAccount = req.signInAccount
            if (signInAccount.roleId === 2) {
                const advertiseId = req.body.params.advertiseId
                const adsFound = await advertisementService.getAdvertiseById(advertiseId)
                console.log(adsFound)
                if (adsFound.length > 0) {
                    console.log(advertiseId)
                    const isDelete = await advertisementService.updateAdvertiseStatus(advertiseId, 4)
                    console.log(isDelete)
                    if (isDelete === true) {
                        res.status(200).json({
                            status: "Success",
                            message: "Delete successfully"
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
                        message: "Not found ads"
                    })
                }
            } else {
                res.status(202).json({
                    status: "Failed",
                    message: "Delete failed, No permisson"
                })
            }
        } catch (error) {
            console.log(error)
        }
    },

    stopAdvertiseByAdmin: async function (req, res, next) {
        try {
            const signInAccount = req.signInAccount
            if (signInAccount.roleId === 2) {
                const advertiseId = req.body.params.advertiseId
                const adsFound = await advertisementService.getAdvertiseById(advertiseId)
                console.log(adsFound)
                if (adsFound.length > 0) {
                    if (adsFound[0].statusId === 2) {
                        const isStopped = await advertisementService.updateAdvertiseStatus(advertiseId, 3)
                        if (isStopped === true) {
                            res.status(200).json({
                                status: "Success",
                                message: "Update successfully"
                            })
                        } else {
                            res.status(202).json({
                                status: "Failed",
                                message: "Update failed"
                            })
                        }
                    } else {
                        res.status(202).json({
                            status: "Failed",
                            message: "Update failed, Advertise is not running yet or stopped before"
                        })
                    }
                } else {
                    res.status(202).json({
                        status: "Failed",
                        message: "Not found ads"
                    })
                }
            } else {
                res.status(202).json({
                    status: "Failed",
                    message: "Update failed, No permisson"
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

}
