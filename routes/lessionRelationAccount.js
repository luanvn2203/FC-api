const express = require('express');
const verifyToken = require('../middleware/auth')
const router = express.Router();
const lessionRelationController = require('../Controller/LessionRelationAccount/LessionRelationAccount')

router.post('/check-permission', verifyToken, lessionRelationController.checkIsAccessible)

module.exports = router;
