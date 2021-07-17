const topicService = require("../../service/topic");
const { responseStatus, responseMessage } = require('./Contants')
module.exports = {
	getAllTopic: async function (req, res, next) {
		console.log(req.signInAccount);
		try {
			// if (req.signInAccount.roleId === 2) {
			const listTopicResult = await topicService.getAllTopic(req.query.page);
			if (listTopicResult) {
				const listTopic = listTopicResult.data;
				res.status(200).json({
					listTopic: listTopic,
					meta: listTopicResult.meta,
				});
			}
			// } else {
			//     res.status(403).json({
			//         status: "Failed",
			//         message: "You have no permission"
			//     });
			// }
		} catch (error) {
			console.log(error);
			res.status(401).json({
				status: responseStatus.FAILED,
				message: error.message,
			});
		}
	},

	findById: async function (req, res, next) {
		try {
			const topicResult = await topicService.getTopicById(req.body);
			console.log("ahhihihihi")
			if (topicResult.length > 0) {
				res.status(200).json({
					status: responseStatus.SUCCESS,
					message: responseMessage.GET_TOPIC_SUCCESS,
					result: topicResult[0],
				});
			} else {
				res.status(202).json({
					status: responseStatus.FAILED,
					message: responseMessage.GET_TOPIC_BY_ID_FAILED_WITH_NO_RECORD,
					result: [],
				});
			}
		} catch (error) {
			console.log(error);
			res.status(401).json({
				status: responseStatus.FAILED,
				message: error.message,
			});
		}
	},

	createNewTopic: async function (req, res, next) {
		try {
			const creator = req.userEmail;
			// const listExistedTopic = await topicService.findTopicByName(req.body.params.topicName)
			// if (!listExistedTopic.length > 0) {
			const result = await topicService.createNewTopic(req.body, creator);
			if (result === true) {
				res.status(201).json({
					status: responseStatus.SUCCESS,
					message: responseMessage.CREATE_TOPIC_SUCCESS,
				});
			} else {
				res.status(202).json({
					status: responseStatus.FAILED,
					message: responseMessage.CREATE_TOPIC_FAILED,
				});
			}
			// } else {
			//     res.status(202).json({
			//         message: "Topic is existed"
			//     })
			// }
		} catch (error) {
			console.log(error);
		}
	},

	searchByName: async function (req, res, next) {
		try {
			const topicName = req.body;
			const result = await topicService.searchByName(topicName);
			if (result.length > 0) {
				res.status(200).json({
					status: responseStatus.SUCCESS,
					topic: result,
				});
			} else {
				res.status(201).json({
					status: responseStatus.FAILED,
					message: responseMessage.SEARCH_TOPIC_BY_NAME_FAILED_WITH_NO_RECORD,
				});
			}
		} catch (error) {
			console.log(error);
		}
	},

	findTopicByEmail: async function (req, res, next) {
		try {
			const signInEmail = req.userEmail;
			const result = await topicService.findemail(signInEmail);
			console.log(signInEmail);
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
			res.status(202).json({
				status: responseStatus.FAILED,
				message: responseMessage.SEARCH_TOPICS_BY_EMAIL_FAILED_WITH_NO_RECORD,
			});
		}
	},
	updateTopicStatusToDelete: async function (req, res, next) {
		try {
			const deleteStatus = 3;
			const userEmail = req.userEmail;
			const deleteResult = await topicService.updateTopicStatus(
				req.body.params.topicId,
				deleteStatus,
				userEmail
			);
			if (deleteResult === true) {
				res.status(200).json({
					status: responseStatus.SUCCESS,
					message: responseMessage.DELETE_TOPIC_SUCCESS,
				});
			} else {
				res.status(202).json({
					status: responseStatus.FAILED,
					message: responseMessage.DELETE_TOPIC_FAILED_WITH_NO_PERMISSION
				});
			}
		} catch (error) {
			console.log(error);
		}
	},
	updateTopicStatusToPublicOrPrivate: async function (req, res, next) {
		try {
			const userEmail = req.userEmail;
			const statusToChange = req.body.params.statusId;
			if (statusToChange === 1 || statusToChange === 2) {
				const updateResult = await topicService.updateTopicStatus(
					req.body.params.topicId,
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
						message: responseMessage.updateTopicStatusSuccess(statusName),
					});
				} else {
					res.status(202).json({
						status: responseStatus.FAILED,
						message:
							responseMessage.UPDATE_TOPIC_STATUS_FAILED_WITH_NO_PERMISSION
					});
				}
			} else {
				res.status(202).json({
					status: responseStatus.FAILED,
					message: responseMessage.UPDATE_TOPIC_STATUS_FAILED_WITH_WRONG_STATUS,
				});
			}
		} catch (error) {
			console.log(error);
		}
	},
	updateTopicInformation: async function (req, res, next) {
		try {
			const signInEmail = req.userEmail;
			const topic = req.body.params
			const topicId = req.body.params.topicId;
			console.log(req.body)
			const topicFound = await topicService.getTopicByIdReuse(topicId)
			if (topicFound.length > 0) {
				if (signInEmail === topicFound[0].accountId) {
					console.log("BANG")
					const result = await topicService.updateTopic(topic);
					if (result === true) {
						res.status(200).json({
							status: responseStatus.SUCCESS,
							message: responseMessage.UPDATE_TOPIC_SUCCESS,
						});
					} else {
						res.status(202).json({
							status: responseStatus.FAILED,
							message: responseMessage.UPDATE_TOPIC_FAILED
						});
					}
				} else {
					res.status(202).json({
						status: responseStatus.FAILED,
						message: responseMessage.UPDATE_TOPIC_FAILED_WITH_NO_PERMISSION
					});
				}
			}
		} catch (error) {
			console.log(error);
		}
	}
};
