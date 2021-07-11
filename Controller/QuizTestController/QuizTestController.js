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
            const resData = [];
            const subjectId = req.body.params.subjectId;
            const listQuizTestFound = await quizTestService.getQuizTestsBySubjectId(subjectId);
            if (listQuizTestFound.length > 0) {
                for (let i = 0; i < listQuizTestFound.length; i++) {
                    const listQuestionFoundEachTest = await quizTestQuestionService.getQuestionsByQuizTestId(listQuizTestFound[i].id)
                    if (listQuestionFoundEachTest.length > 0) {
                        console.log(listQuestionFoundEachTest)
                        for (let j = 0; j < listQuestionFoundEachTest.length; j++) {
                            const listOptionFoundEachQuestion = await optionDetailService.getOptionsByQuestionIdAndFilteredInfo(listQuestionFoundEachTest[j])
                            if (listOptionFoundEachQuestion.length > 0) {
                                listQuestionFoundEachTest[j].options = listOptionFoundEachQuestion
                            }
                        }
                        const data = {
                            testInfo: listQuizTestFound[i],
                            questions: listQuestionFoundEachTest
                        }
                        resData.push(data)
                    } else {
                        const data = {
                            testInfo: listQuizTestFound[i],
                            question: []
                        }
                        resData.push(data)
                    }
                }
                res.status(200).json({
                    status: 'Success',
                    data: resData,
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
    }

}
