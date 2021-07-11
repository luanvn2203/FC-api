const optionDetailService = require("../../service/optionDetail");

module.exports = {
	addNewOptionForQuestion: async function (req, res, next) {
		try {
			const listOption = req.body;
			const result = await optionDetailService.addOptionForAnswer(
				listOption,
				8
			);
			if (result === 1) {
				res.status(200).json({
					status: "Success",
					message: "create option  + req.body.params.topicName",
				});
			} else if (result === -1) {
				res.status(201).json({
					status: "Failed",
					message: "Option have to different in a question",
				});
			} else {
			}
		} catch (error) {
			console.log(error);
		}
	},
};
