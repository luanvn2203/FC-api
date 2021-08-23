const express = require('express');
const quizTestController = require('../Controller/QuizTestController/QuizTestController');
const verifyToken = require('../middleware/auth')
const router = express.Router();

router.post('/create', verifyToken, quizTestController.createNewQuizTest)

router.post('/get-by-subjectId', verifyToken, quizTestController.getQuizTestBySubjectId)

router.post('/questions-by-quiztestid', verifyToken, quizTestController.getQuestionByQuizTestId)

router.post('/take-quiz-questions', verifyToken, quizTestController.getQuestionForUserQuizByTestId)

router.post('/delete', verifyToken, quizTestController.deleteQuizTestById)

router.post('/check-takequiz', verifyToken, quizTestController.checkTakeQuizAccess)

module.exports = router;