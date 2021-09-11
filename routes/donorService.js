const express = require('express');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/auth')

const router = express.Router();

const donorServiceController = require('../Controller/DonorServiceController/DonorServiceController')

router.post('/create', verifyToken, donorServiceController.createService)

router.post('/update', verifyToken, donorServiceController.updateService)

router.post('/delete', verifyToken, donorServiceController.deleteService)

router.get('/all-by-me', verifyToken, donorServiceController.getAllServiceByMe)

router.post('/admin-confirm', verifyToken, donorServiceController.confirmByAdmin)

router.get('/view-all', verifyToken, donorServiceController.getAllForAdminView)

module.exports = router;
