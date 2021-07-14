const flashcardService = require("../../service/flashcard");
const questionService = require("../../service/question");
const optionDetailService = require('../../service/optionDetail')
module.exports = {
	createFlashcard: async function (req, res, next) {
		try {
			const creator = req.userEmail;
			const listExistedFlashcard = await flashcardService.findFlashcardByName(
				req.body
			);
			if (!listExistedFlashcard.length > 0) {
				const result = await flashcardService.createFlashcard(
					req.body,
					creator
				);
				if (result === true) {
					res.status(200).json({
						status: "Success",
						message: "Create flashcard successfully ",
					});
				} else {
					res.status(202).json({
						status: "Failed",
						message: "Create flashcard failed: Invalid params",
					});
				}
			} else {
				res.status(202).json({
					status: "Failed",
					message: "Flashcard is existed",
				});
			}
		} catch (error) {
			console.log(error);
		}
	},

	getAllFlashcard: async function (req, res, next) {
		try {
			const result = await flashcardService.getAllFlashcard();
			if (result.length > 0) {
				res.status(200).json({
					status: "Success",
					listFlashcard: result,
					total: result.length,
				});
			} else {
				res.status(200).json({
					status: "Failed",
					listFlashcard: [],
					total: result.length,
					message: "No flashcard found in database",
				});
			}
		} catch (error) {
			console.log(error);
		}
	},

	getFlashcardByFlashcardId: async function (req, res, next) {
		try {
			const flashcardId = req.body.params.flashcardId;
			console.log(flashcardId)

			const result = await flashcardService.getFlashcardByFlashcardId(
				flashcardId
			);
			if (result.length > 0) {
				res.status(200).json({
					status: "Success",
					message: "Find flashcard successfully",
					flashcard: result,
					total: result.length,
				});
			} else {
				res.status(202).json({
					status: "Failed",
					message: "No record Found",
					flashcard: [],
					total: 0,
				});
			}
		} catch (error) {
			console.log(error);
		}
	},

	// getFlashcardByAcountId: async function (req, res, next) {
	// 	try {
	// 		const accountId = req.body.params.accountId;
	// 		const result = await flashcardService.getFlashcardByAcountId(accountId);
	// 		if (result.length > 0) {
	// 			res.status(200).json({
	// 				status: "Success",
	// 				message: "Find flashcard successfully",
	// 				flashcard: result,
	// 				total: result.length,
	// 			});
	// 		} else {
	// 			res.status(202).json({
	// 				status: "Failed",
	// 				message: "No record Found",
	// 				flashcard: [],
	// 				total: 0,
	// 			});
	// 		}
	// 	} catch (error) {
	// 		console.log(error);
	// 	}
	// },

	getFlashcardByMe: async function (req, res, next) {
		try {
			const userEmail = req.userEmail;
			const result = await flashcardService.getFlashcardByMe(userEmail);
			if (result.length > 0) {
				res.status(200).json({
					status: 'Success',
					listFlashcard: result,
					totalFlashcard: result.length,
				});
			} else {
				res.status(202).json({
					message: 'Failed',
					listFlashcard: [],
					totalFlashcard: 0,
				});
			}
		} catch (error) {
			console.log(error);
		}
	},

	getFlashcardByLessionId: async function (req, res, next) {
		try {
			const lessionId = req.body.params.lessionId;
			const result = await flashcardService.getFlashcardByLessionId(lessionId);
			//result la 1 cai mang flashcard, trong do co id => for de lay cai id truyen vao ham getTotalQuestionByFlashcardId voi moi flash card trong mang
			if (result.length > 0) {
				let resData = [];
				for (let i = 0; i < result.length; i++) {
					const totalfc = await questionService.getTotalQuestionByFlashcardId(
						result[i].flashcardId
					);

					const resObj = {
						flashcardId: result[i].flashcardId,
						flashcardName: result[i].flashcardName,
						flashcardContent: result[i].flashcardContent,
						statusId: result[i].statusId,
						dateOfCreate: result[i].dateOfCreate,
						accountId: result[i].accountId,
						author: result[i].author,
						lessionId: result[i].lessionId,
						totalQuestion: totalfc[0].totalQuestion,
					};
					resData.push(resObj);
				}

				if (resData.length > 0) {
					res.status(200).json({
						status: "Success",
						message: "Find flashcard successfully",
						flashcard: resData,
						total: resData.length,
					});
				}
			} else {
				res.status(201).json({
					status: "Failed",
					message: "No record Found",
					flashcard: [],
					total: 0,
				});
			}
		} catch (error) {
			console.log(error);
		}
	},

	getPublicFlashcardByLessionId: async function (req, res, next) {
		try {
			const lessionId = req.body.params.lessionId;
			const result = await flashcardService.getPublicFlashcardByLessionId(lessionId);
			//result la 1 cai mang flashcard, trong do co id => for de lay cai id truyen vao ham getTotalQuestionByFlashcardId voi moi flash card trong mang
			if (result.length > 0) {
				let resData = [];
				for (let i = 0; i < result.length; i++) {
					const totalfc = await questionService.getTotalQuestionByFlashcardId(
						result[i].flashcardId
					);

					const resObj = {
						flashcardId: result[i].flashcardId,
						flashcardName: result[i].flashcardName,
						flashcardContent: result[i].flashcardContent,
						statusId: result[i].statusId,
						dateOfCreate: result[i].dateOfCreate,
						accountId: result[i].accountId,
						lessionId: result[i].lessionId,
						author: result[i].author,
						totalQuestion: totalfc[0].totalQuestion,
					};
					resData.push(resObj);
				}

				if (resData.length > 0) {
					res.status(200).json({
						status: "Success",
						message: "Find flashcard successfully",
						flashcard: resData,
						total: resData.length,
					});
				}
			} else {
				res.status(201).json({
					status: "Failed",
					message: "Flashcard will be updated by the author as soon as possible",
					flashcard: [],
					total: 0,
				});
			}
		} catch (error) {
			console.log(error);
		}
	},

	UpdateFlashcardByID: async function (req, res, next) {
		try {
			const result = await flashcardService.UpdateFlashcardByID(req.body);
			console.log(result);
			if (result === true) {
				return res.status(200).json({
					status: "Success",
					message: "Update flashcard successfully",
				});
			} else {
				return res.status(202).json({
					status: "Failed",
					message: "Update flashcard failed",
				});
			}
		} catch (error) {
			console.log(error.message);
		}
	},

	updateFlashcardStatusToDelete: async function (req, res, next) {
		try {
			const deleteStatus = 3;
			const userEmail = req.userEmail;
			const deleteResult = await flashcardService.updateFlashcardStatus(
				req.body.params.flashcardId,
				deleteStatus,
				userEmail
			);
			if (deleteResult === true) {
				res.status(200).json({
					status: "Success",
					message: "Delete flascard successfully",
				});
			} else {
				res.status(202).json({
					status: "Failed",
					message:
						"Delete failed, you dont have permission to delete this flashcard",
				});
			}
		} catch (error) {
			console.log(error);
		}
	},
	updateFlashcardStatusToPublicOrPrivate: async function (req, res, next) {
		try {
			const userEmail = req.userEmail;
			const statusToChange = req.body.params.statusId;
			if (statusToChange === 1 || statusToChange === 2) {
				const updateResult = await flashcardService.updateFlashcardStatus(
					req.body.params.flashcardId,
					statusToChange,
					userEmail
				);
				if (updateResult === true) {
					let statusName = null;
					if (statusToChange === 1) {
						statusName = "public";
					} else if (statusToChange === 2) {
						statusName = "private";
					}
					res.status(200).json({
						status: "Success",
						message: `Update to ${statusName} success`,
					});
				} else {
					res.status(202).json({
						status: "Failed",
						message:
							"Update status failed, you do not have permission to update this flashcard",
					});
				}
			} else {
				res.status(202).json({
					status: "Failed",
					message: "Cannot update to this status",
				});
			}
		} catch (error) {
			console.log(error);
		}
	},
	findFlashcardByFtQuestion: async function (req, res, next) {
		try {
			const searchValue = req.body.params.searchValue
			const flashcardFound = await questionService.findFlashCardByQuestionByFullTextSearch(searchValue)
			if (flashcardFound.length > 0) {
				resData = [];
				for (let index = 0; index < flashcardFound.length; index++) {
					//get question by flashcard id with in full text
					const questionFound = await questionService.get3QuestionByFlashcardIdWithinFullTextSearch(searchValue, flashcardFound[index].flashcardId)
					if (questionFound.length > 0) {
						const questions = [];
						for (let i = 0; i < questionFound.length; i++) {
							const optionFound = await optionDetailService.getOptionsByQuestionIdAndFilteredInfo(questionFound[i])
							if (optionFound.length > 0) {
								const questionObj = {
									questionDetail: questionFound[i],
									options: optionFound,
									total_option: optionFound.length
								}
								questions.push(questionObj)
							}
						}
						const resObject = {
							flashcard: flashcardFound[index],
							question_inside: questions,
							limit_question: 3
						}
						resData.push(resObject)
					} else {
						const resObject = {
							flashcard: flashcardFound[index],
							question_inside: [],
							limit_question: 0
						}
						resData.push(resObject)
					}
				}
				res.status(202).json({
					status: "Success",
					data: resData,
					total_flashcard: resData.length
				});

			} else {
				res.status(202).json({
					status: "Failed",
					message: "Not found flashcard with keyword: " + searchValue,
				});
			}
		} catch (error) {
			console.log(error)
		}
	},
	increaseViewByUserClick: async function (req, res, next) {
		try {
			const flashcardToIncrease = req.body.params.flashcardId;
			const userEmail = req.userEmail;
			const flashcardFound = await flashcardService.getFlashcardByFlashcardId(flashcardToIncrease)
			//check 
			if (flashcardFound.length > 0) {
				if (flashcardFound[0].accountId !== userEmail) {
					const isIncrease = await flashcardService.increaseViewByClickByFlashcardId(flashcardToIncrease)
					if (isIncrease === true) {
						res.status(200).json({
							status: "Success",
							message: "Increase view successfully"
						})
					} else {
						res.status(202).json({
							status: "Failed",
							message: "Increase view failed"
						})
					}
				} else {
					res.status(202).json({
						status: "Failed",
						message: "Author cannot increase view of their flashcard"
					})
				}
			} else {
				res.status(202).json({
					status: "Failed",
					message: "Not found flashcard id"
				})
			}

		} catch (error) {
			console.log(error)
		}

	}

};
