const quizTestService = require('../../service/quizTestService')
const quizTestLessionService = require('../../service/quizTestLession')
const flashcardService = require('../../service/flashcard')
const questionService = require('../../service/question')
const optionDetailService = require('../../service/optionDetail')
const quizTestQuestionService = require('../../service/quizTestQuestion')
module.exports = {
    createNewQuizTest: async function (req, res, next) {
        try {
            let isFinalQuiz = 0;
            const questionArr = req.body.params.questionArr;
            const lessionArr = req.body.params.lessionArr;
            if (lessionArr.length > 1) {
                isFinalQuiz = 1
            }
            const userEmail = req.userEmail
            const resultId = await quizTestService.createQuizTest(req.body, userEmail, isFinalQuiz)
            if (resultId !== -1) {
                const isInsertQuizTestLession_table = await quizTestLessionService.addRecordToQuizTestLessionByQuizTestIdAndLessionArray(req.body, resultId)
                if (isInsertQuizTestLession_table === true) {
                    const isInsertQuizTestQuestion_table = await quizTestQuestionService.addRecordToQuizTestQuestionByQuizTestIdAndQuestionArray(questionArr, resultId)
                    if (isInsertQuizTestQuestion_table === true) {
                        res.status(200).json({
                            status: "Success",
                            message: "Create a quiz test success"
                        })
                    } else {
                        res.status(202).json({
                            status: "Failed",
                            message: "Create a quiz test failed"
                        })
                    }
                }
            } else {
                res.status(202).json({
                    status: 'Failed',
                    message: 'Create test failed'
                })
            }
        } catch (error) {
            console.log(error)
        }
    },

    getQuizTestBySubjectId: async function (req, res, next) {
        try {
            // const resData = [];
            const subjectId = req.body.params.subjectId;
            const listQuizTestFound = await quizTestService.getQuizTestsBySubjectId(subjectId);
            if (listQuizTestFound.length > 0) {
                for (let i = 0; i < listQuizTestFound.length; i++) {
                    // goi api get tong so cau hoi       
                    const totalQuestion = await quizTestQuestionService.getTotalQuestionInTest(listQuizTestFound[i].id)
                    if (totalQuestion.length > 0) {
                        listQuizTestFound[i].total_question = totalQuestion[0].total
                    }
                }
                res.status(200).json({
                    status: 'Success',
                    testFound: listQuizTestFound,
                    total_test: listQuizTestFound.length
                })
            } else {
                res.status(202).json({
                    status: 'Failed',
                    message: 'No Test Found in this subject',
                    listQuizTestFound: []
                })
            }
        } catch (error) {
            console.log(error);
        }
    },
    getQuestionByQuizTestId: async function (req, res, next) {
        try {
            const quizTestId = req.body.params.quizTestId;
            const listQuestionFound = await quizTestQuestionService.getQuestionsByQuizTestId(quizTestId)
            if (listQuestionFound.length > 0) {
                for (let i = 0; i < listQuestionFound.length; i++) {
                    const listOptionFoundEachQuestion = await optionDetailService.getOptionsByQuestionIdAndFilteredInfo(listQuestionFound[i])
                    if (listOptionFoundEachQuestion.length > 0) {
                        for (let j = 0; j < listOptionFoundEachQuestion.length; j++) {
                            const isCorrectA = JSON.parse(JSON.stringify(listOptionFoundEachQuestion[j].isCorrect))
                            if (isCorrectA.data[0] === 1) {
                                listOptionFoundEachQuestion[j].isCorrect = true
                            } else {
                                listOptionFoundEachQuestion[j].isCorrect = false
                            }
                        }
                        listQuestionFound[i].options = listOptionFoundEachQuestion
                    } else {
                        listQuestionFound[i].options = []
                    }
                    delete listQuestionFound[i].flashcardId
                    delete listQuestionFound[i].createdDate
                    delete listQuestionFound[i].statusId
                }
                res.status(200).json({
                    status: 'Success',
                    listQuestion: listQuestionFound,
                    total_question: listQuestionFound.length
                })
            } else {
                res.status(202).json({
                    status: 'Faield',
                    listQuestion: [],
                    total_question: 0
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

}
