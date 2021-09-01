const subjectService = require("../../service/subject");
const topicService = require("../../service/topic");
const { responseStatus, responseMessage } = require('./Contants')
const subjectPublicRelationshipService = require('../../service/subjectPublicRelationship')
const Point = require('../../pointConfig')
const accountService = require('../../service/account')
const subjectRelationAccountService = require('../../service/subjectRelationAccount')
const subjectPublicRelationShipService = require('../../service/subjectPublicRelationship');
const subjectRequestService = require('../../service/subjectRequestService')
const lessionService = require('../../service/lession')
const { savePointHistory } = require("../../service/pointHistory");
const learningFlashcardService = require('../../service/learningFlashcard')
module.exports = {
	createNewSubject: async function (req, res, next) {
		const subject = req.body;
		const studentEmail = req.userEmail;

		//sai
		// const listSubject = await subjectService.getAllSubjectByTopicId(subject.params.topicId);

		const listSubjectCreatedByUser =
			await subjectService.findSubjectBySubjectNameAndUserAccount(
				subject,
				studentEmail
			);

		if (!listSubjectCreatedByUser.length > 0) {
			const result = await subjectService.createNewSubject(
				subject,
				studentEmail
			);
			if (result === true) {
				res.status(200).json({
					status: responseStatus.SUCCESS,
					message: responseMessage.CREATE_SUBJECT_SUCCESS
				});
			} else {
				res.status(202).json({
					status: responseStatus.FAILED,
					message: responseMessage.CREATE_SUBJECT_FAILED
				});
			}
		} else {
			res.status(202).json({
				status: responseStatus.FAILED,
				message: responseMessage.DUPLICATE_SUBJECT_NAME_CREATED_BY_USER
			});
		}
	},

	getAllSubjectByTopicId: async function (req, res, next) {
		try {
			const topicId = req.body.params.topicId;
			const result = await subjectService.getAllSubjectByTopicId(topicId);
			if (result.length > 0) {
				res.status(200).json({
					status: responseStatus.SUCCESS,
					topics: result,
					total: result.length,
				});
			} else {
				res.status(202).json({
					status: responseStatus.FAILED,
					topics: [],
					total: 0,
				});
			}
		} catch (error) {
			console.log(error);
		}
	},
	getTopFiveSubjectByListOfTopicId: async function (req, res, next) {
		try {
			const listTopicFound = await topicService.getAllTopicInArrayOfId(
				req.body.params.listTopicId
			);
			if (listTopicFound.length > 0) {
				const listSubjectFound =
					await subjectService.getAllSubjectInListTopicId(
						req.body.params.listTopicId
					);

				if (listSubjectFound.length > 0) {
					const resData = [];

					listTopicFound.forEach((topic) => {
						const topicName = topic.topicName;
						const listSubjectInName = [];

						listSubjectFound.forEach((subject) => {
							if (subject.topicId === topic.topicId) {
								listSubjectInName.push(subject);
							}
						});
						resData.push({
							topic: topicName,
							subjects: listSubjectInName,
						});
					});
					res.status(200).json({
						status: responseStatus.SUCCESS,
						listSubject: resData,
						total: listSubjectFound.length,
					});
				} else {
					res.status(200).json({
						status: responseStatus.FAILED,
						listSubject: [],
						total: 0,
					});
				}
			} else {
				res.status(200).json({
					status: responseStatus.FAILED,
					message: responseMessage.GET_SUBJECT_FAILED_BY_LIST_TOPIC_ID_WITH_NOT_FOUND_TOPIC_ID,
					total: 0,
				});
			}
		} catch (error) {
			console.log(error);
		}
	},
	updateSubject: async function (req, res, next) {
		try {
			const result = await subjectService.updateSubject(req.body);
			if (result === true) {
				res.status(200).json({
					status: responseStatus.SUCCESS,
					message: responseMessage.UPDATE_SUBJECT_SUCCESS,
				});
			} else {
				res.status(201).json({
					status: responseStatus.FAILED,
					message: responseMessage.UPDATE_SUBJECT_FAILED
				});
			}
		} catch (error) {
			console.log(error);
		}
	},
	getTop5PopularSubjectByTopicId: async function (req, res, next) {
		try {
			const publicStatus = 1;
			const result = await subjectService.getTop5SubjectByTopicId(
				req.body,
				publicStatus
			);
			if (result.length > 1) {
				res.status(200).json({
					status: responseStatus.SUCCESS,
					listSubject: result,
				});
			} else {
				res.status(201).json({
					status: responseStatus.FAILED,
					message: responseMessage.GET_SUBJECT_FAILED_BY_TOPIC_ID,
					listSubject: [],
				});
			}
		} catch (error) {
			console.log(error);
		}
	},
	getTop5SubjectPerInterestTopicForStudentHome: async function (
		req,
		res,
		next
	) {
		try {
			const userEmail = req.userEmail
			const publicStatus = 1;
			const listTopicFound = await topicService.getAllTopicInArrayOfId(
				req.body.params.listTopicId
			);
			if (listTopicFound.length > 0) {
				let resData = [];
				for (let i = 0; i < listTopicFound.length; i++) {
					const listSubjectFound = await subjectService.getTop5SubjectByTopicId(listTopicFound[i].topicId, publicStatus);
					if (listSubjectFound.length > 0) {
						for (let count = 0; count < listSubjectFound.length; count++) {
							console.log(listSubjectFound[count])
							console.log(listSubjectFound[count].accountId, userEmail)
							if (listSubjectFound[count].accountId === userEmail) {
								listSubjectFound[count].joinStatus = 'Join'
							}
							// if (listSubjectFound[count].statusId === 1) {
							const totalLessonInSubject = await lessionService.countTotalPublicLessionInASubject(listSubjectFound[count].subjectId)
							console.log(totalLessonInSubject[0].total)
							let PointToMinus = totalLessonInSubject[0].total * Point.point_define.public_lesson
							console.log(PointToMinus)
							listSubjectFound[count].point_require = PointToMinus
							// } else if (listSubjectFound[count].statusId === 2) {
							// 	const totalLessonInSubject = await lessionService.countTotalLessionInASubject(listSubjectFound[count].subjectId)
							// 	console.log(totalLessonInSubject[0].total)
							// 	let PointToMinus = totalLessonInSubject[0].total * Point.point_define.private_lesson
							// 	console.log(PointToMinus)
							// 	listSubjectFound[count].point_require = PointToMinus

							// }
						}
						// const listPrivateRequestSubject = await subjectRequestService.getAllRequestSendFromEmail(userEmail)
						// if (listPrivateRequestSubject.length > 0) {
						// 	for (let index = 0; index < listSubjectFound.length; index++) {
						// 		for (let index2 = 0; index2 < listPrivateRequestSubject.length; index2++) {
						// 			if (listSubjectFound[index].subjectId === listPrivateRequestSubject[index2].subjectId) {
						// 				// listSubjectFound[index].joinStatus = listPrivateRequestSubject[index2].statusId
						// 				if (listPrivateRequestSubject[index2].statusId === 1) {
						// 					listSubjectFound[index].joinStatus = "Waiting Author Approve"
						// 				} else if (listPrivateRequestSubject[index2].statusId === 2) {
						// 					listSubjectFound[index].joinStatus = "Author Approved Access"
						// 				} else {
						// 					listSubjectFound[index].joinStatus = "Author Denine Access"
						// 				}
						// 			} else {
						// 				listSubjectFound[index].joinStatus = 'Not join'
						// 			}
						// 		}

						// 	}
						// }
						const listPublicSubjectEmailJoined = await subjectPublicRelationshipService.getPublicSubjectUserHaveJoinedByEmail(userEmail)
						for (let index3 = 0; index3 < listSubjectFound.length; index3++) {
							listSubjectFound[index3].joinStatus = "Not join"
							for (let index4 = 0; index4 < listPublicSubjectEmailJoined.length; index4++) {
								if (listSubjectFound[index3].subjectId === listPublicSubjectEmailJoined[index4].subjectId) {
									listSubjectFound[index3].joinStatus = "Join"
								}
							}
						}
					}
					let topicAndSubjectInside = {
						topicDetail: listTopicFound[i],
						listSubjects: listSubjectFound,
					};
					resData.push(topicAndSubjectInside);
				}
				if (resData.length > 0) {
					res.status(200).json({
						status: responseStatus.SUCCESS,
						listData: resData,
						total: resData.length,
					});
				} else {
					res.status(201).json({
						status: responseStatus.FAILED,
						listData: [],
						total: 0,
					});
				}
			} else {
				res.status(200).json({
					status: responseStatus.FAILED,
					message: responseMessage.GET_SUBJECT_FAILED_FOR_INTEREST_HOME_WITH_NOT_FOUND_TOPIC_ID,
					total: 0,
				});
			}
		} catch (error) {
			console.log(error);
		}
	},
	getSubjectBySignedInEmail: async function (req, res, next) {
		try {
			const userEmail = req.userEmail;
			const result = await subjectService.getSubjectBySignedInEmail(userEmail);
			if (result.length > 0) {
				res.status(200).json({
					status: responseStatus.SUCCESS,
					listSubject: result,
					total: result.length,
				});
			} else {
				res.status(202).json({
					status: responseStatus.FAILED,
					listSubject: [],
					total: 0,
				});
			}
		} catch (error) {
			console.log(error);
		}
	},
	getSubjectByAuthor: async function (req, res, next) {
		try {
			const listSubject = await subjectService.getSubjectByEmail(
				req.body.params.authorId
			);
			if (listSubject.length > 0) {
				res.status(200).json({
					status: responseStatus.SUCCESS,
					listSubject: listSubject,
					total_subject: listSubject.length,
				});
			} else {
				res.status(202).json({
					status: responseStatus.FAILED,
					listSubject: [],
					total_subject: 0,
				});
			}
		} catch (error) {
			console.log(error);
		}
	},
	deleteSubjectByAuthor: async function (req, res, next) {
		try {
			const userEmail = req.userEmail;
			const deleteStatus = 3;
			const deleteResult = await subjectService.updateSubjectStatus(
				req.body.params.subjectId,
				deleteStatus,
				userEmail
			);
			if (deleteResult === true) {
				res.status(200).json({
					status: responseStatus.SUCCESS,
					message: responseMessage.DELETE_SUBJECT_BY_AUTHOR_SUCCESS,
				});
			} else {
				res.status(202).json({
					status: responseStatus.FAILED,
					message:
						responseMessage.DELETE_SUBJECT_BY_AUTHOR_FAILED_WITH_NO_PERMISSION
				});
			}
		} catch (error) {
			console.log(error);
		}
	},
	changeStatusToPublicOrPrivate: async function (req, res, next) {
		try {
			const userEmail = req.userEmail;
			const statusToChange = req.body.params.statusId;
			if (statusToChange === 1 || statusToChange === 2) {
				const updateResult = await subjectService.updateSubjectStatus(
					req.body.params.subjectId,
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
						status: responseStatus.SUCCESS,
						message: responseMessage.updateSubjectStatus_SUCCESS(statusName),
					});
				} else {
					res.status(202).json({
						status: responseStatus.FAILED,
						message:
							responseMessage.UPDATE_SUBJECT_STATUS_FAILED_WITH_NO_PERMISSION,
					});
				}
			} else {
				res.status(202).json({
					status: responseStatus.FAILED,
					message: responseMessage.UPDATE_SUBJECT_STATUS_FAILED_WITH_WRONG_STATUS,
				});
			}
		} catch (error) {
			console.log(error);
		}
	},
	getSubjectByTopicIdForMe: async function (req, res, next) {
		const result = await subjectService.getSubjectByTopicId(
			req.body.params.topicId
		);
		if (result.length > 0) {
			res.status(200).json({
				status: responseStatus.SUCCESS,
				listSubject: result,
				total: result.length,
			});
		} else {
			res.status(202).json({
				status: responseStatus.FAILED,
				listSubject: [],
			});
		}
	},
	findSubjectByNameAndDescription: async function (req, res, next) {
		try {
			const userEmail = req.userEmail
			const searchValue = req.body.params.searchValue
			const result = await subjectService.findSubjectByNameAndDes(searchValue)
			if (result.length > 0) {
				for (let count = 0; count < result.length; count++) {
					console.log(result[count])
					console.log(result[count].accountId, userEmail)
					if (result[count].accountId === userEmail) {
						result[count].joinStatus = 'Joined'
					}
					if (result[count].statusId === 1) {
						const totalLessonInSubject = await lessionService.countTotalLessionInASubject(result[count].subjectId)
						console.log(totalLessonInSubject[0].total)
						let PointToMinus = totalLessonInSubject[0].total * Point.point_define.private_lesson
						console.log(PointToMinus)
						result[count].point_require = PointToMinus
					} else if (result[count].statusId === 2) {
						const totalLessonInSubject = await lessionService.countTotalLessionInASubject(result[count].subjectId)
						console.log(totalLessonInSubject[0].total)
						let PointToMinus = totalLessonInSubject[0].total * Point.point_define.private_lesson
						console.log(PointToMinus)
						result[count].point_require = PointToMinus

					}
				}



				const listPrivateRequestSubject = await subjectRequestService.getAllRequestSendFromEmail(userEmail)
				if (listPrivateRequestSubject.length > 0) {
					for (let index = 0; index < result.length; index++) {
						for (let index2 = 0; index2 < listPrivateRequestSubject.length; index2++) {
							if (result[index].subjectId === listPrivateRequestSubject[index2].subjectId) {
								// result[index].joinStatus = listPrivateRequestSubject[index2].statusId
								if (listPrivateRequestSubject[index2].statusId === 1) {
									result[index].joinStatus = "Waiting author approve"
								} else if (listPrivateRequestSubject[index2].statusId === 2) {
									result[index].joinStatus = "Author Approved Access"
								} else {
									result[index].joinStatus = "Author Denine Access"
								}

							} else {
								result[index].joinStatus = 'Not join'
							}
						}
					}
				}
				const listPublicSubjectEmailJoined = await subjectPublicRelationshipService.getPublicSubjectUserHaveJoinedByEmail(userEmail)
				for (let index3 = 0; index3 < result.length; index3++) {
					for (let index4 = 0; index4 < listPublicSubjectEmailJoined.length; index4++) {
						if (result[index3].subjectId === listPublicSubjectEmailJoined[index4].subjectId) {
							result[index3].joinStatus = "Joined"
						}
					}
				}
				res.status(200).json({
					status: responseStatus.SUCCESS,
					searchResult: result,
					total_subject: result.length
				})
			} else {
				res.status(200).json({
					status: responseStatus.FAILED,
					searchResult: [],
					total_subject: result.length
				})
			}
		} catch (error) {
			console.log(error)
		}
	},
	findSubjectByLessionNameAndDescription: async function (req, res, next) {
		try {
			const searchValue = req.body.params.searchValue
			const result = await subjectService.findSubjectByLessionNameAndDes(searchValue)
			if (result.length > 0) {
				res.status(200).json({
					status: responseStatus.SUCCESS,
					searchResult: result,
					total_subject: result.length
				})
			} else {
				res.status(200).json({
					status: responseStatus.FAILED,
					searchResult: [],
					total_subject: result.length
				})
			}

		} catch (error) {
			console.log(error)
		}
	},
	findSubjectByFlashcardName: async function (req, res, next) {
		try {
			const searchValue = req.body.params.searchValue
			const result = await subjectService.findSubjectByftFlashcardName(searchValue)
			if (result.length > 0) {
				res.status(200).json({
					status: responseStatus.SUCCESS,
					searchResult: result,
					total_subject: result.length
				})
			} else {
				res.status(200).json({
					status: responseStatus.FAILED,
					searchResult: [],
					total_subject: result.length
				})
			}

		} catch (error) {
			console.log(error)
		}
	},
	findSubjectByQuestionContent: async function (req, res, next) {
		try {
			const searchValue = req.body.params.searchValue
			const result = await subjectService.findSubjectByftQuestionContent(searchValue)
			if (result.length > 0) {
				res.status(200).json({
					status: responseStatus.SUCCESS,
					searchResult: result,
					total_subject: result.length
				})
			} else {
				res.status(200).json({
					status: responseStatus.FAILED,
					searchResult: [],
					total_subject: result.length
				})
			}
		} catch (error) {
			console.log(error)
		}
	},

	increaseViewByUserClick: async function (req, res, next) {
		try {
			const subjectToIncrease = req.body.params.subjectId;
			const userEmail = req.userEmail;
			const subjectFound = await subjectService.getSubjecDetailById(subjectToIncrease)
			//check 
			if (subjectFound.length > 0) {
				if (subjectFound[0].accountId !== userEmail) {
					const isIncrease = await subjectService.increaseViewByClickBySubjectId(subjectToIncrease)
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
					//chu nhan cua subject
					res.status(202).json({
						status: "Failed",
						message: "Author cannot increase view of their subject"
					})
				}
			} else {
				res.status(202).json({
					status: "Failed",
					message: "Not found subject id"
				})
			}

		} catch (error) {
			console.log(error)
		}
	},
	getSubjectById: async function (req, res, next) {
		try {
			const subjectId = req.body.params.subjectId;
			const result = await subjectService.getSubjectById(subjectId)
			if (result.length > 0) {
				res.status(200).json({
					status: "Success",
					subjectFound: result[0]
				})
			} else {
				res.status(202).json({
					status: "Failed",
					message: "Not found subject"
				})
			}
		} catch (error) {
			console.log(error)
		}
	},

	savePublicRelationShip: async function (req, res, next) {
		try {
			const signInAccount = req.signInAccount
			const subjectId = req.body.params.subjectId;
			const learingInProgressStatus = 1;
			// find relation truoc
			const isExistedRelation = await subjectPublicRelationshipService.getRelationByAccountIdAndSubjectId(signInAccount.email, subjectId)
			if (isExistedRelation.length > 0) {
				res.status(202).json({
					status: "Failed",
					message: "Save relation failed by existed relationship"
				})
			} else {

				const totalLessonInSubject = await lessionService.countTotalPublicLessionInASubject(subjectId)
				let PointToMinus = totalLessonInSubject[0].total * Point.point_define.public_lesson

				if (signInAccount.point > PointToMinus) {
					const subjectFound = await subjectService.getSubjectById(subjectId)
					console.log(subjectFound)
					//tru diem truoc
					const isMinusPoint = await accountService.minusPointToAccountByEmail(signInAccount.email, PointToMinus)
					if (isMinusPoint === true) {
						const useType = 6
						const description = `${signInAccount.email} use ${PointToMinus} point to access the subjectId: ${subjectFound[0].subjectName}`
						await savePointHistory(signInAccount.email, PointToMinus, useType, description)
						const result = await subjectPublicRelationshipService.savePublicRelationship(signInAccount.email, subjectId, learingInProgressStatus)
						if (result === true) {
							res.status(200).json({
								status: "Success",
								message: "Save relation success"
							})
						} else {
							res.status(202).json({
								status: "Failed",
								message: "Save relation Failed"
							})
						}
					} else {
						res.status(202).json({
							status: "Failed",
							message: "Minus point failed..."
						})
					}
				} else {
					res.status(202).json({
						status: "Failed",
						message: "No point left, require 3 point to view this content"
					})
				}

			}


		} catch (error) {
			console.log(error)
		}
	},

	checkAccessPublicSubject: async function (req, res, next) {
		try {
			const userEmail = req.userEmail
			const subjectId = req.body.params.subjectId
			const subjectFound = await subjectService.getSubjectById(subjectId)

			if (subjectFound.length > 0) {
				if (subjectFound[0].accountId !== userEmail) {
					const isExistedRelation = await subjectPublicRelationshipService.getRelationByAccountIdAndSubjectId(userEmail, subjectId)
					console.log(isExistedRelation)
					if (isExistedRelation.length > 0) {
						res.status(200).json({
							status: "Success",
							message: "Relation existed, approved access"
						})
					} else {
						const totalLessonInSubject = await lessionService.countTotalPublicLessionInASubject(subjectId)
						let PointToMinus = totalLessonInSubject[0].total * Point.point_define.private_lesson
						res.status(202).json({
							status: "Failed",
							message: "Do you wan to use " + PointToMinus + " point to view this content"
						})
					}
				} else {
					res.status(200).json({
						status: "Success",
						message: "Author, approved access"
					})
				}
			}

		} catch (error) {
			console.log(error)
		}
	},

	getRecentLearningSubject: async function (req, res, next) {
		try {
			const userEmail = req.userEmail
			let resData = null
			const privateSubjectRecentLearning = await subjectRelationAccountService.getRecentLearningPrivateSubject(userEmail)
			const publicSubjectRecentLearning = await subjectPublicRelationShipService.getRecentLearningPublicSubject(userEmail)
			resData = privateSubjectRecentLearning.concat(publicSubjectRecentLearning)
			resData.sort((a, b) => (new Date(b.joinDate)) - (new Date(a.joinDate)));

			for (let index = 0; index < resData.length; index++) {


				// const totalLesson = await lessionService.countTotalLessionInASubject(resData[index].subjectId)
				// if (totalLesson.length > 0) {
				// 	resData[index].totalLesson = totalLesson[0].total
				// }


				const totalFlashcardInside = await subjectService.getTotalFlashcardInSubject(resData[index].subjectId)
				if (totalFlashcardInside.length > 0) {
					resData[index].totalFLashcard = totalFlashcardInside[0].totalFLashcard
				}

				const completeFlashcard = await learningFlashcardService.countCompleteFlashcardBySubjectId(userEmail, resData[index].subjectId)
				if (completeFlashcard.length > 0) {
					resData[index].completeFlashcard = completeFlashcard[0].completeFlashcard
				}

				const percentComplete = (completeFlashcard[0].completeFlashcard / totalFlashcardInside[0].totalFLashcard) * 100
				resData[index].completePercent = percentComplete || 0


				// const listLessonFound = lessionService.getLessionBySubjectId(resData[index].subjectId)
				// if (listLessonFound.length > 0) {
				// 	for (let index2 = 0; index2 < listLessonFound.length; index2++) {
				// 		// const totalFlashcardInside
				// 	}
				// } else {
				// 	// no lesson inside
				// }

			}


			// get so lesson trong subject
			// count lesson
			// get lesson completion
			// get flashcard completetion trong lesson
			// => phan tram hoc xong
			// => return




			if (resData.length > 0) {
				res.status(200).json({
					status: "Success",
					recentSubject: resData,
					total: resData.length
				})
			} else {
				res.status(200).json({
					status: "Failed",
					recentSubject: resData,
					total: resData.length
				})
			}
		} catch (error) {
			console.log(error)
		}

	}

};
