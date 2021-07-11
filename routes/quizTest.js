const express = require('express');
const quizTestController = require('../Controller/QuizTestController/QuizTestController');
const verifyToken = require('../middleware/auth')
const router = express.Router();

router.post('/create', verifyToken, quizTestController.createNewQuizTest)

router.post('/get-by-subjectId', verifyToken, quizTestController.getQuizTestBySubjectId)

module.exports = router;