require('dotenv').config();
const express = require('express');
const verifyToken = require('../middleware/auth')
const router = express.Router();
//controller
const accountController = require('../Controller/AccountController/AccountController');


/* GET accounts for admin */
router.get('/all', verifyToken, accountController.getAllAccountForAdmin);

//checkLogin
router.post('/login', accountController.postLogin);

//token
router.post("/token", verifyToken, accountController.getNewAccessToken);

//get my info
router.get('/me', verifyToken, accountController.getMyInformation)

//logout 
router.get('/logout', verifyToken, accountController.deleteLogout);

//Register account
router.post("/register", accountController.postRegister);

//verifyToken in the email after register
router.get("/verify/:token", accountController.verifyAccountByTokenInTheEmail);

//update account
router.put('/update', verifyToken, accountController.postUpdateAccount);

//change user password
router.put('/change-password', verifyToken, accountController.postChangePassword);

//search accounts by email
router.post('/email-search', verifyToken, accountController.postSearchAccountByEmail);

router.put('/update-interest', verifyToken, accountController.updateInterest)

router.post('/ban-account', verifyToken, accountController.banAccountForAdminRole)

router.put('/add-point', verifyToken, accountController.addPointToAccount)

router.put('/minus-point', verifyToken, accountController.minusPointsToAccount)

router.post('/user-infor', verifyToken, accountController.getUserInformation)
module.exports = router;