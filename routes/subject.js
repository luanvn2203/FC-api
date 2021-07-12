const express = require('express');
const verifyToken = require('../middleware/auth')

const router = express.Router();
const subjectController = require('../Controller/SubjectController/SubjectController');
const { route } = require('./quizTest');

router.post('/create', verifyToken, subjectController.createNewSubject)

router.post('/all-by-topic', verifyToken, subjectController.getAllSubjectByTopicId)

router.post('/by-list-topic-id', subjectController.getTopFiveSubjectByListOfTopicId)

router.put('/update', verifyToken, subjectController.updateSubject)

router.post('/five-popular-subject', verifyToken, subjectController.getTop5PopularSubjectByTopicId)

router.post('/for-home-interest', subjectController.getTop5SubjectPerInterestTopicForStudentHome)

router.get('/subject-by-signin-mail', verifyToken, subjectController.getSubjectBySignedInEmail)

router.get('/find-by-author-public', verifyToken, subjectController.getSubjectByAuthor)

router.post('/delete', verifyToken, subjectController.deleteSubjectByAuthor)

router.put('/change-status', verifyToken, subjectController.changeStatusToPublicOrPrivate)

router.post('/find-by-topicid', verifyToken, subjectController.getSubjectByTopicIdForMe)

router.post('/find-name-des', verifyToken, subjectController.findSubjectByNameAndDescription)

router.post('/find-name-des-lession', verifyToken, subjectController.findSubjectByLessionNameAndDescription)

router.post('/find-name-flashcard', verifyToken, subjectController.findSubjectByFlashcardName)

router.post('/find-by-question', verifyToken, subjectController.findSubjectByQuestionContent)

router.put('/increase-view', verifyToken, subjectController.increaseViewByUserClick)


module.exports = router;
