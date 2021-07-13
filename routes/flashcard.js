const express = require('express');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/auth')

const router = express.Router();

const flashcardController = require('../Controller/FlashcardController/FlashcardController');

router.post('/create-flashcard', verifyToken, flashcardController.createFlashcard)

router.get('/get-all-flashcard', flashcardController.getAllFlashcard)

router.post('/get-flashcard-by-flashcardid', flashcardController.getFlashcardByFlashcardId)

// router.post('/get-flashcard-by-accountid', verifyToken, flashcardController.getFlashcardByAcountId)

router.post('/get-flashcard-by-lessionid', flashcardController.getFlashcardByLessionId)

router.put('/update-flashcard-by-flashcardid', flashcardController.UpdateFlashcardByID)

router.get('/get-flashcard-by-me', verifyToken, flashcardController.getFlashcardByMe)

router.post('/delete', verifyToken, flashcardController.updateFlashcardStatusToDelete)

router.put('/change-status', verifyToken, flashcardController.updateFlashcardStatusToPublicOrPrivate)

router.post('/public-flashcard-by-lessionid', verifyToken, flashcardController.getPublicFlashcardByLessionId)

router.post('/find-by-ft-question', verifyToken, flashcardController.findFlashcardByFtQuestion)


module.exports = router;
