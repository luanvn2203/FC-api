const lessionService = require("../../service/lession");

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
					message: "No lession found in database",
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
					message: "Get lession successfully",
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
					message: "Get lession successfully",
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
			const subjectId = req.body.params.subjectId;
			const result = await lessionService.getLessionBySubjectId(subjectId);
			if (result.length > 0) {
				res.status(200).json({
					status: "Success",
					message: "Get lession successfully",
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
						message: "Create lession successfully",
					});
				} else {
					res.status(201).json({
						status: "Failed",
						message: "Create lession failed",
					});
				}
			} else {
				res.status(200).json({
					status: "Failed",
					message: "Lession is Existed in you subject",
				});
			}
		} catch (error) {
			console.log(error);
		}
	},

	UpdateLessionByID: async function (req, res, next) {
		try {
			const result = await lessionService.UpdateLessionByID(req.body);
			console.log(result);
			if (result === true) {
				return res.status(200).json({
					status: "Success",
					message: "Update lession successfully",
				});
			} else {
				return res.status(205).json({
					status: "Failed",
					message: "Update lession failed",
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
			const deleteResult = await lessionService.updateLessionStatus(
				req.body.params.lessionId,
				deleteStatus,
				userEmail
			);
			if (deleteResult === true) {
				res.status(200).json({
					status: "Success",
					message: "Delete lession successfully",
				});
			} else {
				res.status(202).json({
					status: "Failed",
					message:
						"Delete failed, you dont have permission to delete this lession",
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
};
