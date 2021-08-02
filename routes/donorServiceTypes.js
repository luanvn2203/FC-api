const express = require('express');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/auth')

const router = express.Router();

const donorServiceTypesController = require('../Controller/DonorServiceTypesController/donorServiceTypesController')

router.get('/all-type', verifyToken, donorServiceTypesController.getAllServiceTypes)

module.exports = router;
