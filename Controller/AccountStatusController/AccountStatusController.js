require("dotenv").config();
const accountStatusService = require("../../service/accountStatus");

module.exports = {
	getAllRole: async function (req, res, next) {
		try {
			const listAccountStatus =
				await accountStatusService.getAllAccountStatus();
			if (listAccountStatus.length > 0) {
				res.status(200).json({
					status: "Success",
					listStatus: listAccountStatus,
					total: listAccountStatus.length,
				});
			} else {
				res.status(200).json({
					status: "Failed",
					listAccountStatus: [],
					total: listAccountStatus.length,
					message: "No account status found in database",
				});
			}
		} catch (error) {
			console.log(error);
		}
	},
};
