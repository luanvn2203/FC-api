const express = require('express');
const verifyToken = require('../middleware/auth')
const router = express.Router();
const quizHistoryController = require('../Controller/QuizHistoryController/QuizHistoryController')

router.post('/submit', verifyToken, quizHistoryController.saveQuizHistory)

router.post('/get-by-id', verifyToken, quizHistoryController.getQuizHistoryById)



module.exports = router;
