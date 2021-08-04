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



module.exports = router;
