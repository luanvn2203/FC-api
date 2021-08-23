const express = require('express');
const verifyToken = require('../middleware/auth')
const router = express.Router();

const lessionPublicRelationshipController = require('../Controller/LessionPublicRelationShip/LessionPublicRelationship')

router.post('/save-recent-learning', verifyToken, lessionPublicRelationshipController.saveRecentLearningLession)

module.exports = router;
