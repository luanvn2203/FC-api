require('dotenv').config();
const express = require('express');
const router = express.Router();
const accountStatusController = require('../Controller/AccountStatusController/AccountStatusController')

router.get('/', accountStatusController.getAllRole)

module.exports = router;