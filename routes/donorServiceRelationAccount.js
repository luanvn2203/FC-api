const express = require('express');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/auth')

const router = express.Router();

const donorServiceRelationAccountController = require('../Controller/DonorServiceRelationAccountController/DonorServiceRelationAccountController')

router.post('/save-relation', verifyToken, donorServiceRelationAccountController.saveRelation)

router.get('/history', verifyToken, donorServiceRelationAccountController.viewReceivedServiceHistoryByMe)

router.get('/available-service', verifyToken, donorServiceRelationAccountController.getAllAvailableService)

module.exports = router;
