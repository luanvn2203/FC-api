const express = require('express');
const verifyToken = require('../middleware/auth')
const lessionRequestController = require('../Controller/LessionRequestController/LessionRequestController')
const router = express.Router();


router.post('/send', verifyToken, lessionRequestController.sendViewLessionRequest)

router.get('/to-me', verifyToken, lessionRequestController.getAllRequestSendToMe)

router.post('/author-approve', verifyToken, lessionRequestController.approveRequest)

router.post('/author-denine', verifyToken, lessionRequestController.denineRequest)

module.exports = router;
