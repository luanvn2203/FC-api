const questionService = require("../../service/question");
const optionDetailService = require("../../service/optionDetail");
const flashcardService = require('../../service/flashcard')
const quizHistoryService = require('../../service/quizHistory')
const quizHistoryDetailService = require('../../service/quizHistoryDetail')
const userChocieService = require('../../service/userChocie')


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
            const saveHistory_id = await quizHistoryService.saveQuizHistory(userEmail, quizTestId, numOfQuestion)
            if (saveHistory_id !== -1) {
                const saveHistoryDetail_id = await quizHistoryDetailService.saveQuizHistoryDetail(saveHistory_id, numOfCorrect, totalCore)
                if (saveHistoryDetail_id !== -1) {
                    //for truoc
                    if (userChoice.length > 0) {
                        for (let i = 0; i < userChoice.length; i++) {
                            const optionId_arr_json = JSON.stringify(userChoice[i].optionId_choice)
                            const isSaveUserChoice = await userChocieService.saveUserChoice(userEmail, optionId_arr_json, saveHistoryDetail_id, userChoice[i].questionId)
                            if (isSaveUserChoice) {
                                console.log("ok ")
                            }
                        }
                    }
                } else {
                    console.log("save detail failed")
                }
                res.status(200).json({
                    status: "Success",
                    totalCore: totalCore,
                    numOfCorrect: numOfCorrect,
                    totalQuestion: numOfQuestion,
                    checkCorrectObj: resDataUserChoice
                })
            } else {
                res.status(202).json({
                    status: "Failed",
                    totalCore: totalCore,
                    numOfCorrect: numOfCorrect,
                    checkCorrectObj: resDataUserChoice
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

}
