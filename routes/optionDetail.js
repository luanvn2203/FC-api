const express = require('express');
const verifyToken = require('../middleware/auth')
const router = express.Router();
const optionDetailController = require('../Controller/OptionDetailController/OptionDetailController')

router.post('/add-option', optionDetailController.addNewOptionForQuestion);

module.exports = router