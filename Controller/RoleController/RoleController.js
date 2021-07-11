const roleService = require("../../service/role");

module.exports = {
	getAllRole: async function (req, res, next) {
		try {
			const listRole = await roleService.getAllRoleWithOutAdmin();
			if (listRole.length > 0) {
				res.status(200).json({
					status: "Success",
					listRole: listRole,
					total: listRole.length,
				});
			} else {
				res.status(200).json({
					status: "Failed",
					listRole: [],
					total: listRole.length,
					message: "No role found in database",
				});
			}
		} catch (error) {
			console.log(error);
		}
	},
};
