const quizTestService = require('../../service/quizTestService')
const quizTestLessionService = require('../../service/quizTestLession')
const flashcardService = require('../../service/flashcard')
const questionService = require('../../service/question')
const optionDetailService = require('../../service/optionDetail')
const quizTestQuestionService = require('../../service/quizTestQuestion')
const lessionService = require('../../service/lession')
const subjectService = require('../../service/subject')
const lessionPublicRelationshipService = require('../../service/lessionPublicRelationShip')

module.exports = {
    createNewQuizTest: async function (req, res, next) {
        try {
            let isFinalQuiz = 0;
            const questionArr = req.body.params.questionArr;

            if (questionArr.length >= 10) {
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
            } else {
                res.status(202).json({
                    status: 'Failed',
                    message: 'A test must have at least 10 question to create'
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
            const subjectDetail = await subjectService.getSubjecDetailById(subjectId);
            if (subjectDetail.length > 0) {

                const listQuizTestFound = await quizTestService.getQuizTestsBySubjectId(subjectId);
                if (listQuizTestFound.length > 0) {



                    for (let i = 0; i < listQuizTestFound.length; i++) {
                        let listLession = [];
                        const lessionIdArray = JSON.parse(listQuizTestFound[i].lessionId_arr)
                        for (let index = 0; index < lessionIdArray.length; index++) {
                            const lessionFound = await lessionService.getLessionByLessionId(lessionIdArray[index])
                            delete lessionFound[0].accountId
                            delete lessionFound[0].subjectId
                            delete lessionFound[0].createdDate
                            delete lessionFound[0].statusId

                            listLession.push(lessionFound[0])
                        }
                        listQuizTestFound[i].lessions = listLession
                        const isManyLession = JSON.parse(JSON.stringify(listQuizTestFound[i].isFinalQuiz))
                        if (isManyLession.data[0] === 1) {
                            listQuizTestFound[i].isManyLession = true
                        } else {
                            listQuizTestFound[i].isManyLession = false
                        }
                        delete listQuizTestFound[i].isFinalQuiz
                        // goi api get tong so cau hoi  

                        const totalQuestion = await quizTestQuestionService.getTotalQuestionInTest(listQuizTestFound[i].id)
                        if (totalQuestion.length > 0) {
                            listQuizTestFound[i].total_question = totalQuestion[0].total
                        }
                        delete listQuizTestFound[i].lessionId_arr

                    }
                    res.status(200).json({
                        status: 'Success',
                        subjectName: subjectDetail[0].subjectName,
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
            } else {
                res.status(202).json({
                    status: 'Failed',
                    message: 'Not found subject id',
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
            const quiztestInfo = await quizTestService.getQuizTestInfomationById(quizTestId)
            if (quiztestInfo.length > 0) {
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
                        quiztestInfo: quiztestInfo[0],
                        listQuestion: listQuestionFound,
                        total_question: listQuestionFound.length,
                    })
                } else {
                    res.status(202).json({
                        status: 'Faield',
                        listQuestion: [],
                        total_question: 0
                    })
                }
            }

        } catch (error) {
            console.log(error)
        }
    },

    getQuestionByQuizTestIdFunction: async function (quizTestId) {
        try {
            const quiztestInfo = await quizTestService.getQuizTestInfomationById(quizTestId)
            if (quiztestInfo.length > 0) {
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
                    // res.status(200).json({
                    //     status: 'Success',
                    //     quiztestInfo: quiztestInfo[0],
                    //     listQuestion: listQuestionFound,
                    //     total_question: listQuestionFound.length,
                    // })
                    return {
                        quiztestInfo: quiztestInfo[0],
                        listQuestion: listQuestionFound,
                        total_question: listQuestionFound.length,
                    }
                } else {
                    return {
                        quiztestInfo: quiztestInfo[0],
                        listQuestion: [],
                        total_question: listQuestionFound.length,
                    }
                }
            }

        } catch (error) {
            console.log(error)
        }
    },
    getQuestionForUserQuizByTestId: async function (req, res, next) {
        try {
            const quizTestId = req.body.params.quizTestId;
            const listQuestionFound = await quizTestQuestionService.getQuestionsForForUserQuizByQuizTestId(quizTestId)
            if (listQuestionFound.length > 0) {
                for (let i = 0; i < listQuestionFound.length; i++) {
                    const listOptionFoundEachQuestion = await optionDetailService.getOptionsByQuestionIdAndFilteredInfoWithRandomIndex(listQuestionFound[i])
                    if (listOptionFoundEachQuestion.length > 0) {
                        for (let j = 0; j < listOptionFoundEachQuestion.length; j++) {
                            delete listOptionFoundEachQuestion[j].isCorrect
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
    },
    deleteQuizTestById: async function (req, res, next) {
        try {
            const userEmail = req.userEmail
            const quizTestId = req.body.params.quizTestId
            const quizTestFound = await quizTestService.getQuizTestInfomationById(quizTestId)
            if (quizTestFound.length > 0) {
                if (quizTestFound[0].accountId === userEmail) {
                    const deleteStatus = 3;
                    const isDelete = await quizTestService.updateQuizTestStatus(quizTestId, deleteStatus)
                    if (isDelete === true) {
                        res.status(200).json({
                            status: "Success",
                            message: "Delete test successfully, testID: " + quizTestId
                        })
                    } else {
                        res.status(202).json({
                            status: "Failed",
                            message: "Delete test failed, testID: " + quizTestId
                        })
                    }
                } else {
                    res.status(202).json({
                        status: "Failed",
                        message: "Delete test failed, You don't have permission "
                    })
                }


            } else {
                res.status(202).json({
                    status: "Failed",
                    message: "Not found  testID: " + quizTestId
                })
            }



        } catch (error) {
            console.log(error)
        }
    },

    checkTakeQuizAccess: async function (req, res, next) {
        try {
            const userEmail = req.userEmail;
            const quizTestId = req.body.params.quizTestId
            const quizTestFound = await quizTestService.getQuizTestInfomationById(quizTestId)
            if (quizTestFound.length > 0) {
                const listLessionIdMemberLearning = await lessionPublicRelationshipService.getAllLessionIdBySubjectId(userEmail, quizTestFound[0].subjectId)
                const listId = []
                for (let index = 0; index < listLessionIdMemberLearning.length; index++) {
                    listId.push(listLessionIdMemberLearning[index].lessionId)
                }
                console.log(listId, JSON.parse(quizTestFound[0].lessionId_arr))

                if (checker(listId, JSON.parse(quizTestFound[0].lessionId_arr)) === true) {
                    res.status(200).json({
                        status: "Success",
                        message: "Member can take quiz now"
                    })
                } else {
                    const lessionRequireId = JSON.parse(quizTestFound[0].lessionId_arr).filter(e => !listId.includes(e))
                    const resData = []
                    for (let i = 0; i < lessionRequireId.length; i++) {
                        const lessionF = await lessionService.getLessionByLessionId(lessionRequireId[i])
                        resData.push({
                            lessionId: lessionF[0].lessionId,
                            lessionName: lessionF[0].lessionName
                        })
                    }
                    res.status(202).json({
                        status: "Failed",
                        message: "Member need to complete learning require lesson before take quiz",
                        requireLesson: resData,
                        total: resData.length
                    })

                }
            } else {
                res.status(202).json({
                    status: "Failed",
                    message: "Not found test ID"
                })
            }



        } catch (error) {
            console.log(error)
        }
    }

}
let checker = (arr, target) => target.every(v => arr.includes(v));