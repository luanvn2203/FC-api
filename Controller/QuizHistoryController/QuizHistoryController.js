const { db } = require("../../config");
const optionDetailService = require("../../service/optionDetail");
const quizHistoryService = require('../../service/quizHistory')
const userChocieService = require('../../service/userChocie');
const QuizTestController = require("../QuizTestController/QuizTestController");
const quizTestService = require('../../service/quizTestService')

function diffArray(arr1, arr2) {
    return arr1
        .concat(arr2)
        .filter(item => !arr1.includes(item) || !arr2.includes(item));
}

module.exports = {
    saveQuizHistory: async function (req, res, next) {
        try {
            const userEmail = req.userEmail;
            const quizTestId = req.body.params.quizTestId;
            const numOfQuestion = req.body.params.numOfQuestion;
            const userChoice = req.body.params.userChoice
            let resDataUserChoice = userChoice;
            let numOfCorrect = 0
            let totalCore = 0
            //tinh diem
            for (let index = 0; index < userChoice.length; index++) {
                //get true option Id each question
                const true_optionId = await optionDetailService.getTrueOptionByQuestionId(userChoice[index].questionId)
                resDataUserChoice[index].trueOptionId = true_optionId
                if (true_optionId.length !== userChoice[index].optionId_choice.length) {
                } else {
                    if (diffArray(true_optionId, userChoice[index].optionId_choice).length === 0) {
                        numOfCorrect += 1
                    } else {
                    }
                }
            }
            totalCore = (numOfCorrect / numOfQuestion) * 10
            //save to database
            const saveHistory_id = await quizHistoryService.saveQuizHistory(userEmail, quizTestId, numOfQuestion, numOfCorrect, totalCore)
            if (saveHistory_id !== -1) {
                if (userChoice.length > 0) {
                    for (let i = 0; i < userChoice.length; i++) {
                        const optionId_arr_json = JSON.stringify(userChoice[i].optionId_choice)
                        const isSaveUserChoice = await userChocieService.saveUserChoice(userEmail, optionId_arr_json, saveHistory_id, userChoice[i].questionId)
                        if (isSaveUserChoice) {
                            console.log("ok ")
                        }
                    }
                }
                const timeOfTakeQuiz = await quizHistoryService.getNumOfTakeQuizTime(userEmail, quizTestId)
                if (timeOfTakeQuiz.length > 0) {
                    const quiztestFound = await quizTestService.getQuizTestInfomationById(quizTestId)
                    if (quiztestFound.length > 0) {
                        res.status(200).json({
                            status: "Success",
                            result: {
                                quizTestId: quizTestId,
                                quizHistoryId: saveHistory_id,
                                point: totalCore,
                                numOfCorrect: numOfCorrect,
                                numOfQuestion: numOfQuestion,
                                NumOfTakeQuizTime: timeOfTakeQuiz[0].timeOfTakeQuiz,//so lan lam
                                testId: quizTestId,
                                testName: quiztestFound[0].testName
                            }
                        })
                    }
                }

            } else {
                res.status(202).json({
                    status: "Failed",
                    quizTestId: quizTestId,
                    quizHistoryId: saveHistory_id,
                })
            }
        } catch (error) {
            console.log(error)
        }
    },
    getQuizHistoryById: async function (req, res, next) {
        try {
            const historyId = req.body.params.historyId;
            const quizHistoryFound = await quizHistoryService.getQuizHistoryById(historyId)
            if (quizHistoryFound.length > 0) {
                const listQuestionFound = await QuizTestController.getQuestionByQuizTestIdFunction(quizHistoryFound[0].quiztestId)
                const user_choice = await userChocieService.getUserChoiceByHistoryId(historyId)
                if (user_choice.length > 0) {
                    res.status(200).json({
                        status: "Success",
                        history: quizHistoryFound[0],
                        user_choice: user_choice,
                        test_detail: listQuestionFound
                    })
                }
            } else {
                res.status(200).json({
                    status: "Failed",
                    message: "Not found history ID"
                })
            }

        } catch (error) {
            console.log(error)
        }
    },
    getAllQuizHistoryByMe: async function (req, res, next) {
        try {
            const userEmail = req.userEmail
            const listSubjectIdMemberTake = await quizHistoryService.getListSubjectIdMemberTake(userEmail)
            // const listQuizTestIdMemberTake = await quizHistoryService.getListQuizTestMemberTakeByEmail(userEmail)
            console.log(listSubjectIdMemberTake)
            if (listSubjectIdMemberTake.length > 0) {
                let listSubject = []
                for (let i = 0; i < listSubjectIdMemberTake.length; i++) {
                    //child 
                    const listQuizTestPerSubject = await quizHistoryService.getListQuizTestPerSubject(userEmail, listSubjectIdMemberTake[i].subjectId)
                    for (let j = 0; j < listQuizTestPerSubject.length; j++) {

                    }
                    listSubject.push({
                        subjectId: listSubjectIdMemberTake[i].subjectId,
                        subjectName: listSubjectIdMemberTake[i].subjectName,
                        listTest: listQuizTestPerSubject
                    })
                }
                for (let k = 0; k < listSubject.length; k++) {
                    const listTestPersub = listSubject[k].listTest
                    for (let h = 0; h < listTestPersub.length; h++) {
                        const listHistoryPerTest = await quizHistoryService.getListHistoryPerQuizTest(userEmail, listTestPersub[h].quiztestId)
                        if (listHistoryPerTest.length > 0) {
                            listTestPersub[h].child = listHistoryPerTest
                            listTestPersub[h].totalTakeQuiz = listHistoryPerTest.length
                        } else {
                            listTestPersub[h].child = []
                            listTestPersub[h].totalTakeQuiz = listHistoryPerTest.length

                        }
                    }
                }

                // listSubject?.map((item, index) => {
                //     item?.listTest.map(async (test, index2) => {
                //         const listHistoryPerTest = await quizHistoryService.getListHistoryPerQuizTest(userEmail, test.quiztestId)
                //         if (listHistoryPerTest.length > 0) {
                //             test.child = listHistoryPerTest
                //         }


                //     })
                // })

                res.status(200).json({
                    status: "Success",
                    listHistory: listSubject
                })
            } else {
                res.status(202).json({
                    status: "Failed",
                    listHistory: listSubjectIdMemberTake,
                    total: listSubjectIdMemberTake.length
                })
            }





            // const userEmail = req.userEmail
            // const listHistoryFound = await quizHistoryService.getAllQuizHistoryByAccountId(userEmail)
            // if (listHistoryFound.length > 0) {
            //     res.status(200).json({
            //         status: "Success",
            //         listHistory: listHistoryFound,
            //         total: listHistoryFound.length
            //     })
            // } else {
            //     res.status(200).json({
            //         status: "Failed",
            //         listHistory: listHistoryFound,
            //         total: listHistoryFound.length
            //     })
            // }
        } catch (error) {
            console.log(error)
        }
    }

}
