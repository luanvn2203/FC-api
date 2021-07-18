const express = require('express');
const verifyToken = require('../middleware/auth')
const router = express.Router();
const quizHistoryController = require('../Controller/QuizHistoryController/QuizHistoryController')
const subjectRequestController = require('../Controller/SubjectRequestController/SubjectRequestController')
const subjectRelationController = require('../Controller/SubjectRelationAccountController/SubjectRelationAccountController')
// router.post('/approve', verifyToken, subjectRequestController.sendViewSubjectRequest)
router.post('/check-permission', verifyToken, subjectRelationController.checkIsAccessible)

module.exports = router;
