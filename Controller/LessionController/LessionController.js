const lessionService = require("../../service/lession");
const flashcardService = require('../../service/flashcard')
const subjectService = require("../../service/subject")
const lessionRequestService = require('../../service/lessionRequestService')

module.exports = {
	getAllLession: async function (req, res, next) {
		try {
			const result = await lessionService.getAllLession();
			if (result.length > 0) {
				res.status(200).json({
					status: "Success",
					listLession: result,
					total: result.length,
				});
			} else {
				res.status(200).json({
					status: "Failed",
					listLession: [],
					total: result.length,
					message: "No lesson found in database",
				});
			}
		} catch (error) {
			console.log(error);
		}
	},

	getLessionByLessionId: async function (req, res, next) {
		try {
			const lessionId = req.body.params.lessionId;
			const result = await lessionService.getLessionByLessionId(lessionId);
			if (result.length > 0) {
				res.status(200).json({
					status: "Success",
					message: "Get lesson successfully",
					lession: result,
					total: result.length,
				});
			} else {
				res.status(201).json({
					status: "Failed",
					message: "No record Found",
					lession: [],
					total: 0,
				});
			}
		} catch (error) {
			console.log(error);
		}
	},

	getLessionByAcountId: async function (req, res, next) {
		try {
			const accountId = req.body.params.accountId;
			const result = await lessionService.getLessionByAcountId(accountId);
			if (result.length > 0) {
				res.status(200).json({
					status: "Success",
					message: "Get lesson successfully",
					lession: result,
					total: result.length,
				});
			} else {
				res.status(201).json({
					status: "Failed",
					message: "No record Found",
					lession: [],
					total: 0,
				});
			}
		} catch (error) {
			console.log(error);
		}
	},

	getLessionByMe: async function (req, res, next) {
		try {
			const userEmail = req.userEmail;
			const result = await lessionService.getLessionByMe(userEmail);
			if (result.length > 0) {
				res.status(200).json({
					status: "Success",
					listLession: result,
					totalLession: result.length,
				});
			} else {
				res.status(202).json({
					status: "Failed",
					listLession: [],
					totalLession: 0,
				});
			}
		} catch (error) {
			console.log(error);
		}
	},

	getLessionBySubjectId: async function (req, res, next) {
		try {
			const userEmail = req.userEmail
			const subjectId = req.body.params.subjectId;
			const subjectFound = await subjectService.getSubjectById(subjectId)
			if (subjectFound.length > 0) {
				const result = await lessionService.getLessionBySubjectId(subjectId);
				if (result.length > 0) {
					for (let index = 0; index < result.length; index++) {
						const checkComplete = await lessionService.checkComplete(result[index].lessionId, userEmail)
						if (checkComplete.length > 0) {
							result[index].isComplete = true
						} else {
							result[index].isComplete = false
						}

					}
					if (subjectFound[0].accountId === userEmail) {
						for (let count = 0; count < result.length; count++) {
							result[count].joinStatus = "Join"
						}
						res.status(200).json({
							status: "Success",
							message: "Get lesson successfully",
							lession: result,
							total: result.length,
						});
					} else {
						const listRequestFromMe = await lessionRequestService.getAllRequestByEmail(userEmail)
						if (listRequestFromMe.length > 0) {
							for (let index = 0; index < result.length; index++) {
								const checkComplete = await lessionService.checkComplete(result[index].lessionId, userEmail)
								if (checkComplete.length > 0) {
									result[index].isComplete = true
								} else {
									result[index].isComplete = false
								}

								for (let index2 = 0; index2 < listRequestFromMe.length; index2++) {
									if (result[index].lessionId === listRequestFromMe[index2].lessionId) {
										if (listRequestFromMe[index2].statusId === 1) {
											result[index].joinStatus = "Waiting from author"
										} else if (listRequestFromMe[index2].statusId === 2) {
											result[index].joinStatus = "Author approved"
										} else {
											result[index].joinStatus = "Author denine"
										}
									} else {
										if (result[index].statusId === 1) {
											result[index].joinStatus = "Join"
										} else {
											result[index].joinStatus = "Not join"
										}

									}
								}
							}
						} else {
							for (let index3 = 0; index3 < result.length; index3++) {
								if (result[index3].statusId === 2) {
									result[index3].joinStatus = "Not join"

								} else {
									result[index3].joinStatus = "Join"
								}
							}
						}
						res.status(200).json({
							status: "Success",
							message: "Get lesson successfully",
							lession: result,
							subjectStatus: subjectFound[0].statusId,
							total: result.length,
						});

					}


				} else {
					res.status(201).json({
						status: "Failed",
						message: "No record Found",
						lession: [],
						total: 0,
					});
				}
			} else {
				res.status(201).json({
					status: "Failed",
					message: "Not found subject",

				});
			}

		} catch (error) {
			console.log(error);
		}
	},
	getPublicLessionBySubjectId: async function (req, res, next) {
		try {
			const subjectId = req.body.params.subjectId;
			const result = await lessionService.getLessionBySubjectIdByPublicStatus(
				subjectId
			);
			if (result.length > 0) {
				res.status(200).json({
					status: "Success",
					lession: result,
					total: result.length,
				});
			} else {
				res.status(201).json({
					status: "Failed",
					message: "Lessons will be updated by the author as soon as possible",
					lession: [],
					total: 0,
				});
			}
		} catch (error) {
			console.log(error);
		}
	},

	createNewLessionBySubjectId: async function (req, res, next) {
		try {
			const creator = req.userEmail;
			const subjectId = req.body.params.subjectId
			const lessionStatus = req.body.params.statusId
			const subjectFound = await subjectService.getSubjectById(subjectId)
			if (subjectFound.length > 0) {
				if (subjectFound[0].statusId === 1) {

					const listExistedLession =
						await lessionService.findLessionByNameAndSubjectId(req.body);
					if (!listExistedLession.length > 0) {
						const result = await lessionService.createNewLessionBySubjectId(
							req.body,
							creator
						);
						if (result === true) {
							res.status(200).json({
								status: "Success",
								message: "Create lesson successfully",
							});
						} else {
							res.status(201).json({
								status: "Failed",
								message: "Create lesson failed",
							});
						}
					} else {
						res.status(200).json({
							status: "Failed",
							message: "Lesson is Existed in you subject",
						});
					}
				} else if (subjectFound[0].statusId === 2) {
					if (lessionStatus === subjectFound[0].statusId) {
						const listExistedLession =
							await lessionService.findLessionByNameAndSubjectId(req.body);
						if (!listExistedLession.length > 0) {
							const result = await lessionService.createNewLessionBySubjectId(
								req.body,
								creator
							);
							if (result === true) {
								res.status(200).json({
									status: "Success",
									message: "Create lesson successfully",
								});
							} else {
								res.status(201).json({
									status: "Failed",
									message: "Create lesson failed",
								});
							}
						} else {
							res.status(200).json({
								status: "Failed",
								message: "Lesson is Existed in you subject",
							});
						}
					} else {
						res.status(200).json({
							status: "Failed",
							message: "In a private subject cannot contain public lesson, try again with private status of lesson !",
						});
					}
				} else {
					res.status(200).json({
						status: "Failed",
						message: "Error 237 lesson controller",
					});
				}


			} else {
				res.status(200).json({
					status: "Failed",
					message: "Not found subjectId",
				});
			}

		} catch (error) {
			console.log(error);
		}
	},

	UpdateLessionByID: async function (req, res, next) {
		try {
			const lessonFound = await lessionService.getLessionByLessionId(req.body.params.lessionId)
			if (lessonFound.length > 0) {
				const subjectFound = await subjectService.getSubjectById(lessonFound[0].subjectId)
				if (subjectFound.length > 0) {
					const subjectStatus = subjectFound[0].statusId
					const paramsStatus = req.body.params.statusId

					if (subjectStatus === 1) {
						const result = await lessionService.UpdateLessionByID(req.body);
						if (result === true) {
							return res.status(200).json({
								status: "Success",
								message: "Update lesson successfully",
							});
						} else {
							return res.status(205).json({
								status: "Failed",
								message: "Update lesson failed",
							});
						}
					} else if (subjectStatus === 2) {
						if (paramsStatus === 2) {
							const result = await lessionService.UpdateLessionByID(req.body);
							console.log(result);
							if (result === true) {
								return res.status(200).json({
									status: "Success",
									message: "Update lesson successfully",
								});
							} else {
								return res.status(205).json({
									status: "Failed",
									message: "Update lesson failed",
								});
							}
						} else {
							return res.status(205).json({
								status: "Failed",
								message: "Private subject cannot contain public lesson, try again with private status",
							});
						}
					} else {
						return res.status(202).json({
							error: "error 310 lesson controller"
						})
					}
				} else {
					return res.status(205).json({
						status: "Failed",
						message: "Not found subject ID , 296 lesson controller",
					});
				}
			} else {
				return res.status(205).json({
					status: "Failed",
					message: "Not found lesson ID",
				});
			}

		} catch (error) {
			console.log(error.message);
		}
	},

	updateLessionStatusToDelete: async function (req, res, next) {
		try {
			const deleteStatus = 3;
			const userEmail = req.userEmail;
			const lessionId = req.body.params.lessionId
			const isLessonIsLearning = await lessionService.isLessionIsLearning(lessionId)
			if (isLessonIsLearning.length === 0) {

				const deleteResult = await lessionService.updateLessionStatus(
					req.body.params.lessionId,
					deleteStatus,
					userEmail
				);
				if (deleteResult === true) {
					res.status(200).json({
						status: "Success",
						message: "Delete lesson successfully",
					});
				} else {
					res.status(202).json({
						status: "Failed",
						message:
							"Delete failed, you dont have permission to delete this lesson",
					});
				}
			} else {
				res.status(202).json({
					status: "Failed",
					message:
						"Delete failed, lesson is learning by someone",
				});
			}



		} catch (error) {
			console.log(error);
		}
	},
	updateLessionStatusToPublicOrPrivate: async function (req, res, next) {
		try {
			const userEmail = req.userEmail;
			const statusToChange = req.body.params.statusId;
			if (statusToChange === 1 || statusToChange === 2) {
				const updateResult = await lessionService.updateLessionStatus(
					req.body.params.lessionId,
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
							"Update status failed, you do not have permission to update this lession",
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
	findLessionByFullTextFlashcard: async function (req, res, next) {
		try {
			const searchValue = req.body.params.searchValue
			const flashcardFound = await flashcardService.findFlashcardByFullTextFlashcard(searchValue)
			const resData = []
			const listLessionId = []
			if (flashcardFound.length > 0) {
				for (let i = 0; i < flashcardFound.length; i++) {
					//get array of lession id
					listLessionId.push(flashcardFound[i].lessionId)
				}
				const uniqueIdList = Array.from(new Set(listLessionId))
				if (listLessionId.length > 0) {
					for (let index = 0; index < uniqueIdList.length; index++) {
						const lessionFound = await lessionService.getLessionByLessionId(uniqueIdList[index])
						if (lessionFound.length > 0) {
							// co lession
							for (let le_index = 0; le_index < lessionFound.length; le_index++) {
								// tao flashcard inside
								const flashcard_inside = [];
								for (let fc_index = 0; fc_index < flashcardFound.length; fc_index++) {
									// console.log(flashcardFound[fc_index].lessionId, lessionFound[le_index].lessionId)
									if (flashcardFound[fc_index].lessionId === lessionFound[le_index].lessionId) {
										flashcard_inside.push(flashcardFound[fc_index])
									}
								}
								const resObject = {
									lession: lessionFound[le_index],
									flashcard_inside: flashcard_inside.filter((item, index) => index < 2),
									total_flashcard: flashcard_inside.filter((item, index) => index < 2).length
								}
								resData.push(resObject)
							}
						}
					}
				}
				res.status(200).json({
					status: "Success",
					total: resData.length,
					data: resData,
				})
			} else {
				res.status(202).json({
					status: "Failed",
					message: "Not found result with keyword: " + searchValue
				})
			}
			// if (result.length > 0) {
			// 	res.status(200).json({
			// 		status: responseStatus.SUCCESS,
			// 		searchResult: result,
			// 		total_subject: result.length
			// 	})
			// } else {
			// 	res.status(200).json({
			// 		status: responseStatus.FAILED,
			// 		searchResult: [],
			// 		total_subject: result.length
			// 	})
			// }

		} catch (error) {
			console.log(error)
		}
	},

	increaseViewByUserClick: async function (req, res, next) {
		try {
			const lessionToIncrease = req.body.params.lessionId;
			const userEmail = req.userEmail;
			const lessionFound = await lessionService.getLessionByLessionId(lessionToIncrease)
			//check 
			if (lessionFound.length > 0) {
				if (lessionFound[0].accountId !== userEmail) {
					const isIncrease = await lessionService.increaseViewByClickByLessionId(lessionToIncrease)
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
						message: "Author cannot increase view of their lession"
					})
				}
			} else {
				res.status(202).json({
					status: "Failed",
					message: "Not found lession id"
				})
			}

		} catch (error) {
			console.log(error)
		}


	}
};
