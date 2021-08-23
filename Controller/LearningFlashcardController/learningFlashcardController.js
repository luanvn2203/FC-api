
const lessionService = require("../../service/lession");
const flashcardService = require('../../service/flashcard')
const subjectService = require("../../service/subject")
const lessionRequestService = require('../../service/lessionRequestService')

const learningFlashcardService = require('../../service/learningFlashcard')
const lessionPublicRelationshipService = require('../../service/lessionPublicRelationShip')

module.exports = {
    saveLearningFlashcard: async function (req, res, next) {
        try {
            const userEmail = req.userEmail
            const flashcardId = req.body.params.flashcardId
            const relationFound = await learningFlashcardService.getRecentLearningByEmailAndFlashcardID(userEmail, flashcardId)
            if (relationFound.length === 0) {
                const flashcardFound = await flashcardService.getFlashcardByFlashcardId(flashcardId)
                if (flashcardFound.length > 0) {
                    const isSave = await learningFlashcardService.saveLearningFLashcardByEmailAndFlashcardId(userEmail, flashcardId, flashcardFound[0].lessionId)
                    if (isSave === true) {
                        const listLessionFound = await flashcardService.getFlashcardByLessionId(flashcardFound[0].lessionId)
                        const listFlashcardLearning = await learningFlashcardService.getAllRelationByLessionId(userEmail, flashcardFound[0].lessionId)
                        if (listLessionFound.length === listFlashcardLearning.length) {
                            await lessionPublicRelationshipService.saveRelationShip(userEmail, flashcardFound[0].lessionId)
                        }
                        res.status(202).json({
                            status: "Success",
                            message: "save relation success",
                        })
                    }
                } else {
                    res.status(202).json({
                        status: "Failed",
                        message: "Not found flashcard Id"
                    })
                }
            } else {
                res.status(202).json({
                    status: "Failed",
                    message: "Relation is existing"
                })
            }


        } catch (error) {
            console.log(error)
        }
    }
};
