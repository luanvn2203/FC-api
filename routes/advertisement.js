const express = require('express');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/auth')

const router = express.Router();

const advertisementController = require('../Controller/AdvertisementController/AdvertisementController')

router.post('/create', verifyToken, advertisementController.createNewAdvertise)

router.post('/update', verifyToken, advertisementController.updateAdvertise)

router.post('/delete', verifyToken, advertisementController.deleteAdvertise)

router.get('/all-me', verifyToken, advertisementController.getAllAdvertiseByMe)

router.get('/all-admin', verifyToken, advertisementController.getAllAdvertiseForAdminManagement)

router.post('/run-ads', verifyToken, advertisementController.approveRunningAdsByAdmin)

router.get('/get-current-ads', advertisementController.getAdvertiseForCurrentRendering)

router.post('/admin-remove', verifyToken, advertisementController.removeAdsByAdmin)

router.post('/admin-stop', verifyToken, advertisementController.stopAdvertiseByAdmin)

router.post('/admin-refund', verifyToken, advertisementController.refundDonorPoint)

module.exports = router;
