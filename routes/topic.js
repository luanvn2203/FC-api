const express = require('express');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/auth')

const router = express.Router();
const topicService = require('../service/topic');
const topicController = require('../Controller/TopicController/TopicController')

router.get('/all', topicController.getAllTopic);

router.get('/find-id', topicController.findById);

router.post('/create', verifyToken, topicController.createNewTopic);

router.post('/search', verifyToken, topicController.searchByName);

router.get('/find-by-email', verifyToken, topicController.findTopicByEmail)

router.post('/delete', verifyToken, topicController.updateTopicStatusToDelete)

router.put('/change-status', verifyToken, topicController.updateTopicStatusToPublicOrPrivate)

module.exports = router;
