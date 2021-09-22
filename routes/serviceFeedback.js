require('dotenv').config();
const express = require('express');
const router = express.Router();

const serviceFeedBack = require('../Controller/ServiceFeedbackController/ServiceFeedBackController');
const verifyToken = require('../middleware/auth');

router.post('/save', verifyToken, serviceFeedBack.saveFeedback)

router.get('/admin-view', verifyToken, serviceFeedBack.viewFeedbackForAdminRole)

router.get('/donor-view', verifyToken, serviceFeedBack.viewFeedbackForDonorRole)

module.exports = router;