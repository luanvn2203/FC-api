require('dotenv').config();
const express = require('express');
const router = express.Router();
const roleController = require('../Controller/RoleController/RoleController')

//get all role
router.get('/', roleController.getAllRole)

module.exports = router;