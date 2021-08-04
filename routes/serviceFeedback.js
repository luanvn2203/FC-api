require('dotenv').config();
const express = require('express');
const router = express.Router();

const serviceFeedBack = require('../Controller/ServiceFeedbackController/ServiceFeedBackController');
const verifyToken = require('../middleware/auth');
//get all role
router.post('/save', verifyToken, serviceFeedBack.saveFeedback)

module.exports = router;