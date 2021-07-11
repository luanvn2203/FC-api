const express = require('express');
const verifyToken = require('../middleware/auth')
const router = express.Router();
const questionController = require('../Controller/QuestionController/QuestionController')

// router.post('/add-question', questionController.addNewQuestionToFlashCard)

router.post('/add-question-opt', verifyToken, questionController.addNewQuestionAndOption)

router.post('/get-questions-by-flashcard', verifyToken, questionController.getAllQuestionByFlashcardId)

router.post('/delete', verifyToken, questionController.deleteQuestion)

router.put('/update-question-otp', questionController.updateQuestionAndOption)

router.post('/arr-lessionid', questionController.getQuestionByArrayOfLessionId)

module.exports = router;

