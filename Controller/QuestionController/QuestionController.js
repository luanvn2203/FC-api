const questionService = require("../../service/question");
const optionDetailService = require("../../service/optionDetail");
const flashcardService = require('../../service/flashcard')
module.exports = {
    addNewQuestionToFlashCard: async function (req, res, next) {
        try {
            const result = await questionService.addNewQuestionToFlashCard(req.body);
            console.log(result);
            if (result !== false && result !== undefined) {
                res.status(200).json({
                    status: "Success",
                    message: "Add new question success",
                    question: result,
                });
            } else {
                res.status(201).json({
                    status: "Failed",
                    message: "Add new question failed",
                });
            }
        } catch (error) {
            console.log(error);
        }
    },
    addNewQuestionAndOption: async function (req, res, next) {
        try {
            const question = req.body.params.question;
            const options = req.body.params.options;
            const listOptionContent = [];
            options.forEach((element) => {
                listOptionContent.push(element.optionContent.trim());
            });

            let result = listOptionContent.filter((item, index) => {
                return listOptionContent.indexOf(item) != index;
            });
            if (result.length > 0) {
                //option bi trung
                res.status(202).json({
                    status: "Failed",
                    message: "Option must be unique in a question",
                });
            } else {
                // const userEmail = req.userEmail;
                const addQuestionResultId =
                    await questionService.addNewQuestionToFlashCard(question);
                if (addQuestionResultId !== -1) {
                    // const latestQuestionId = await questionService.getLatestInsertQuestionID(question.flashCardId);
                    const addOptionResult = await optionDetailService.addOptionForAnswer(
                        options,
                        addQuestionResultId
                    );
                    if (addOptionResult === true) {
                        res.status(200).json({
                            status: "Success",
                            message: "Create question successfully",
                            // question: question,
                            // options: options
                        });
                    }
                } else {
                    console.log(" bang -1");
                }
            }
        } catch (error) {
            console.log(error);
        }
    },

    getQuestionByFlashcardId: async function (req, res, next) {
        try {
            const flashcardId = req.body.params.flashcardId;
            const result = await questionService.getQuestionByFlashcardId(
                flashcardId
            );
            if (result.length > 0) {
                res.status(200).json({
                    status: "Success",
                    question: result,
                    total: result.length,
                });
            } else {
                res.status(201).json({
                    status: "Failed",
                    question: [],
                    total: 0,
                });
            }
        } catch (error) {
            console.log(error);
        }
    },
    getAllQuestionByFlashcardId: async function (req, res, next) {
        try {
            let resData = [];
            const listQuestion = await questionService.getQuestionsByFlashcardId(
                req.body
            );
            if (listQuestion.length > 0) {
                for (let i = 0; i < listQuestion.length; i++) {
                    const listOptionInQuestion =
                        await optionDetailService.getOptionsByQuestionId(listQuestion[i]);
                    if (listOptionInQuestion.length > 0) {
                        const resObj = {
                            question: listQuestion[i],
                            option: listOptionInQuestion,
                            total_option: listOptionInQuestion.length,
                        };
                        resData.push(resObj);
                    } else {
                        const resObj = {
                            question: listQuestion[i],
                            option: [],
                            total_option: 0,
                        };
                        resData.push(resObj);
                    }
                }
                res.status(200).json({
                    status: "Success",
                    data: resData,
                    total_question: resData.length,
                });
            } else {
                res.status(202).json({
                    status: "Failed",
                    listData: [],
                    total: 0,
                });
            }
        } catch (error) {
            console.log(error);
        }
    },

    deleteQuestion: async function (req, res, next) {
        try {
            const result = await questionService.updateQuestionStatus(req.body, 3);
            if (result === true) {
                res.status(200).json({
                    status: "Success",
                    message: "Delete question successfully",
                });
            } else {
                res.status(202).json({
                    status: "Failed",
                    message: "Delete question failed",
                });
            }
        } catch (error) {
            console.log(error);
        }
    },
    // updateQuestionAndOption: async function (req, res, next) {
    //     console.log(req.body);
    //     try {
    //         const question = req.body.params.question;
    //         const options = req.body.params.options;

    //         const listOptionContent = [];
    //         options.forEach((element) => {
    //             listOptionContent.push(element.optionContent.trim());
    //         });
    //         console.log(listOptionContent);


    //     } catch (error) {
    //         console.log(error)
    //     }
    // },

    getQuestionByFlashcardId: async function (req, res, next) {
        try {
            const flashcardId = req.body.params.flashcardId;
            const result = await questionService.getQuestionByFlashcardId(flashcardId);
            if (result.length > 0) {
                res.status(200).json({
                    status: "Success",
                    question: result,
                    total: result.length,
                })
            } else {
                res.status(201).json({
                    status: "Failed",
                    question: [],
                    total: 0,
                })
            }
        } catch (error) {
            console.log(error);
        }
    },
    getAllQuestionByFlashcardId: async function (req, res, next) {
        try {
            let resData = [];
            const listQuestion = await questionService.getQuestionsByFlashcardId(req.body.params.flashcardId)
            if (listQuestion.length > 0) {
                for (let i = 0; i < listQuestion.length; i++) {
                    const listOptionInQuestion = await optionDetailService.getOptionsByQuestionId(listQuestion[i]);
                    if (listOptionInQuestion.length > 0) {
                        const resObj = {
                            question: listQuestion[i],
                            option: listOptionInQuestion,
                            total_option: listOptionInQuestion.length
                        }
                        resData.push(resObj)
                    } else {
                        const resObj = {
                            question: listQuestion[i],
                            option: [],
                            total_option: 0
                        }
                        resData.push(resObj)
                    }
                }
                res.status(200).json({
                    status: "Success",
                    data: resData,
                    total_question: resData.length
                })
            } else {
                res.status(202).json({
                    status: 'Failed',
                    listData: [],
                    total: 0
                })
            }
        } catch (error) {
            console.log(error)
        }
    },


    updateQuestionAndOption: async function (req, res, next) {
        console.log(req.body);
        try {
            const question = req.body.params.question;
            const options = req.body.params.options;

            const listOptionContent = [];
            options.forEach(element => {
                listOptionContent.push(element.optionContent.trim())
            });
            console.log(listOptionContent)

            let result = listOptionContent.filter((item, index) => {
                return listOptionContent.indexOf(item) != index
            })
            if (result.length > 0) {
                res.status(202).json({
                    status: 'Failed',
                    message: 'Option must be unique in a question'
                })
            } else {
                const isUpdateQuestion = await questionService.updateQuestionOption(question);
                if (isUpdateQuestion === true) {
                    const isUpdateOption = await optionDetailService.updateOptionsByQuestionId(options)
                    if (isUpdateOption === true) {
                        res.status(200).json({
                            status: "Success",
                            message: "Update question successfully"
                        })
                    }
                } else {
                    res.status(200).json({
                        status: "Failed",
                        message: "Update failed"
                    })
                }
            }
        } catch (error) {
            console.log(error)
        }
    },
    getQuestionByArrayOfLessionId: async function (req, res, next) {
        try {
            const flashcardObject = []
            const lessionArr = req.body.params.lessionArr
            const listFlascardFound = await flashcardService.getFlashcardByArrayLessionIdAndFilteredInfo(lessionArr);
            if (listFlascardFound.length > 0) {
                for (let i = 0; i < listFlascardFound.length; i++) {
                    const questionArr = []
                    const questions = await questionService.getQuestionsByFlashcardIdAndFilteredInfor(listFlascardFound[i].flashcardId)
                    if (questions.length > 0) {
                        for (let j = 0; j < questions.length; j++) {
                            const options = await optionDetailService.getOptionsByQuestionIdAndFilteredInfo(questions[j])
                            const questionInfor = {
                                question: questions[j],
                                options: options
                            }
                            questionArr.push(questionInfor)
                        }
                        flashcardObject.push({
                            flashcard: listFlascardFound[i],
                            questions: questionArr, // mang nhieu cau hoi
                            total_question: questions.length
                        })
                    }
                }

                if (flashcardObject.length > 0) {
                    res.status(200).json({
                        status: "Success",
                        flashcardObj: flashcardObject,
                        total_flashcard: flashcardObject.length,
                        total_lession: lessionArr.length
                    })
                } else {
                    res.status(202).json({
                        status: "Failed",
                        flashcardObj: {},
                        total_flashcard: 0,
                        total_lession: lessionArr.length
                    })
                }
            } else {
                res.status(202).json({
                    status: "Failed",
                    message: "Not found flashcard or question for this Lession Id"
                })
            }

        } catch (error) {
            console.log(error)
        }
    }

}
