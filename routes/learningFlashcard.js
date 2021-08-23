const express = require('express');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/auth')

const router = express.Router();

const learningFlashcardController = require('../Controller/LearningFlashcardController/learningFlashcardController')

router.post('/save', verifyToken, learningFlashcardController.saveLearningFlashcard)

module.exports = router;
