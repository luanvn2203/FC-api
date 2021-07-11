const express = require('express');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/auth')

const router = express.Router();

const lessionController = require('../Controller/LessionController/LessionController');

router.get('/get-all-lession', lessionController.getAllLession)

router.post('/get-lession-by-lessionid', lessionController.getLessionByLessionId)

router.post('/get-lession-by-accountid', verifyToken, lessionController.getLessionByAcountId)

router.post('/get-lession-by-subjectid', lessionController.getLessionBySubjectId)

router.post('/create-lession-by-subjectid', verifyToken, lessionController.createNewLessionBySubjectId)

router.put('/update-lession-by-id', verifyToken, lessionController.UpdateLessionByID)

router.get('/get-lession-by-me', verifyToken, lessionController.getLessionByMe)

router.post('/delete', verifyToken, lessionController.updateLessionStatusToDelete)

router.put('/change-status', verifyToken, lessionController.updateLessionStatusToPublicOrPrivate)

router.post('/public-lession-by-subjectid', verifyToken, lessionController.getPublicLessionBySubjectId)


module.exports = router;
