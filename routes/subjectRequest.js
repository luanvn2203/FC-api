const express = require('express');
const verifyToken = require('../middleware/auth')
const router = express.Router();
const quizHistoryController = require('../Controller/QuizHistoryController/QuizHistoryController')
const subjectRequestController = require('../Controller/SubjectRequestController/SubjectRequestController')

router.post('/send', verifyToken, subjectRequestController.sendViewSubjectRequest)

router.get('/to-me', verifyToken, subjectRequestController.getAllRequestSendToMe)

router.post('/author-approve', verifyToken, subjectRequestController.approveRequest)

router.post('/author-denine', verifyToken, subjectRequestController.denineRequest)

router.get('/from-me', verifyToken, subjectRequestController.getAllRequestSendFromMe)
module.exports = router;
