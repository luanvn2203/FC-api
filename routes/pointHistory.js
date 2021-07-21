const express = require('express');
const verifyToken = require('../middleware/auth')
const router = express.Router();
const PointHistoryController = require('../Controller/PointHistoryController/PointHistoryController')

router.get('/me', verifyToken, PointHistoryController.getMyAllPointHistory)


module.exports = router;
