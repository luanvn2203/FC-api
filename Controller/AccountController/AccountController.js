require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const accountService = require("../../service/account");
const roleService = require("../../service/role");
const accountStatusService = require("../../service/accountStatus");
const { accountMessage } = require("../../lang/vi");
const subjectService = require('../../service/subject')

const generateToken = (payload) => {
	//jwt
	const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: "3h",
	});
	const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
		expiresIn: "5h",
	});
	return { accessToken, refreshToken };
};

//update refreshToken
const updateRefreshToken = async (userEmail, token) => {
	const result = await accountService.updateRefreshToken(userEmail, token);
};
module.exports = {
	getAllAccountForAdmin: async function (req, res, next) {
		try {
			const listAccountResult = await accountService.getAllUser(req.query.page);
			const listRoleResult = await roleService.getAllRole();
			const listStatusResult = await accountStatusService.getAllAccountStatus();
			if (listAccountResult) {
				const accounts = listAccountResult.data;
				accounts.map((account) => {
					listRoleResult.map((role) => {
						if (account.roleId === role.id) {
							account.roleName = role.roleName;
						}
					});
				});
				accounts.map((account) => {
					listStatusResult.map((status) => {
						if (account.statusId === status.id) {
							account.statusName = status.statusName;
						}
					});
				});
				res.status(200).json({
					status: "Success",
					accounts: accounts,
					meta: listAccountResult.meta,
				});
			}
		} catch (err) {
			console.error(`Error while getting account `, err.message);
			next(err);
		}
	},
	postLogin: async function (req, res, next) {
		try {
			const result = await accountService.checkLogin(req.body);
			if (result.length > 0) {
				const account = result[0];
				const accountForToken = {
					email: account.email,
					fullName: account.fullName,
					roleId: account.roleId,
					statusId: account.statusId,
					phone: account.phone,
					address: account.address,
					DOB: account.DOB,
					gender: account.gender,
					interestTopic: account.interestTopic,
					point: account.point
				};

				if (account.statusId != 1) {
					//generate
					const tokens = generateToken(accountForToken);
					updateRefreshToken(account.email, tokens.refreshToken);
					const decoded = jwt.verify(
						tokens.accessToken,
						process.env.ACCESS_TOKEN_SECRET
					);
					const expiredTime = decoded.exp;
					res.status(200).json({
						status: "Success",
						tokens: tokens.accessToken,
						refreshToken: tokens.refreshToken,
						expirationTime: expiredTime,
					});
				} else {
					res.status(200).json({
						status: "Failed",
						Message:
							"Your account is registered but not activate, check you registered email to active account!",
					});
				}
			} else {
				res.status(200).json({
					status: "Failed",
					Message: accountMessage.login_failed,
				});
			}
		} catch (error) {
			res.status(500).json({
				errors: error.message,
			});
			next(error);
		}
	},
	getNewAccessToken: async function (req, res, next) {
		const refreshToken = req.body.refreshToken;
		if (!refreshToken) return res.sendStatus(401);
		const result = await accountService.findAccountByRefreshToken(refreshToken);
		if (result.length > 0) {
			const account = result[0];
			const accountForToken = {
				email: account.email,
				fullName: account.fullName,
				roleId: account.roleId,
				statusId: account.statusId,
				phone: account.phone,
				address: account.address,
				DOB: account.DOB,
				gender: account.gender,
			};
			try {
				jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
				const tokens = generateToken(accountForToken);
				updateRefreshToken(account.email, tokens.refreshToken);
				res.status(200).json({
					tokens,
				});
			} catch (error) {
				res.sendStatus(403);
			}
		}
	},
	getMyInformation: async function (req, res, next) {
		try {
			const signInAccount = req.signInAccount;
			const signInEmail = req.userEmail;
			const accountInDB = await accountService.findAccountByEmail(signInEmail);
			if (accountInDB) {
				accountInDB[0].iat = signInAccount.iat;
				accountInDB[0].exp = signInAccount.exp;
				res.status(200).json({
					account: accountInDB[0],
				});
			} else {
				res.sendStatus(403);
			}
		} catch (error) {
			res.sendStatus(403);
		}
	},
	deleteLogout: async function (req, res, next) {
		const userEmail = req.userEmail;
		updateRefreshToken(userEmail, null);
		res.status(200).json({
			status: "Success",
			message: "Logout successfully",
		});
	},
	postRegister: async function (req, res, next) {
		try {

			const result = await accountService.registerAccount(
				req.body,
				req.protocol,
				req.get("host")
			);
			if (result) {
				res.status(200).json({
					status: "Success",
					message: result,
				});
			} else {
				res.status(205).json({
					status: "Failed",
					message: "Register error",
				});
			}
		} catch (error) {
			if (error.message.includes("Duplicate entry")) {
				res.json({
					status: "Failed",
					message: "Email has been use by someone",
				});
			} else {
				res.json({
					status: error.message,
				});
			}
		}
	},
	verifyAccountByTokenInTheEmail: async function (req, res, next) {
		try {
			// if (data.length > 0) {
			//
			//   }
			const result = await accountService.verifyAccountByEmailToken(
				req.params.token
			);
			if (result.length > 0) {
				//ve sau chinh thanh link
				const isUpdate = accountService.updateAccountStatus(result[0].email, 2);
				if (isUpdate) {
					let redirectLink = `${req.protocol}://localhost:3000/login`;
					res.writeHead(200, { "Content-Type": "text/html" });
					res.write(`<h1>Active accounnt successfully !</h1>
                Login now? <a href=${redirectLink} > LOGIN </a>`);
					res.end();
				} else {
					let redirectLink = `${req.protocol}://localhost:3000/login`;
					res.writeHead(200, { "Content-Type": "text/html" });
					res.write(`<h1>Something went wrong, please contact to admin for getting more information</h1>
                Login now? <a href=${redirectLink} > LOGIN </a>`);
					res.end();
				}
			} else {
				let redirectLink = `${req.protocol}://localhost:3000/login`;
				res.writeHead(200, { "Content-Type": "text/html" });
				res.write(`<h1>Token is expired, please contact admin to get more infomation</h1>
                Back to login? <a href=${redirectLink} > LOGIN </a>`);
				res.end();
			}
			// if (result === true) {
			//     //ve sau chinh thanh link

			//     let redirectLink = `${req.protocol}://localhost:3000/login`;
			//     res.writeHead(200, { 'Content-Type': 'text/html' });
			//     res.write(`<h1>Active accounnt successfully !</h1>
			//     Login now? <a href=${redirectLink} > LOGIN </a>`);
			//     res.end();
			// } else {
			//     res.status(500).json({
			//         Message: "SERVER ERROR"
			//     })
			// }
		} catch (error) {
			res.json({
				errors: error.message,
			});
		}
	},
	postUpdateAccount: async function (req, res, next) {
		try {
			const result = await accountService.updateAccountInformation(req.body);
			if (result === true) {
				return res.status(200).json({
					status: "Success",
					message: "Update account sucessfully",
					email: req.userEmail,
				});
			} else {
				return res.status(202).json({
					status: "Failed",
					message: result.error,
					email: req.userEmail,
				});
			}
		} catch (error) {
			console.log(error.message);
		}
	},
	postChangePassword: async function (req, res, next) {
		try {
			const password = await accountService.getPasswordByEmail(req.userEmail);
			const passwordFromDB = password[0].password;
			const oldPassword = req.body.params.oldPassword;
			const newPassword = req.body.params.newPassword;

			let valid = await bcrypt.compare(oldPassword, passwordFromDB);
			if (valid) {
				const result = await accountService.changePassword(
					req.userEmail,
					newPassword
				);
				if (result === true) {
					return res.status(200).json({
						status: "Success",
						message: "Change password success",
						email: req.userEmail,
					});
				} else {
					return res.status(201).json({
						status: " Failed",
						message: "Change password failed",
						email: req.userEmail,
					});
				}
			} else {
				res.status(201).json({
					status: " Failed",
					message: "Old password is incorrect",
					email: req.userEmail,
				});
			}
		} catch (error) {
			console.log(error);
		}
	},
	postSearchAccountByEmail: async function (req, res, next) {
		try {
			const searchResult = await accountService.findAccountByEmail(req.body);
			if (searchResult.length) {
				res.status(200).json({
					status: "Success",
					total: searchResult.length,
					result: searchResult,
				});
			} else {
				res.status(200).json({
					status: "Failed",
					total: searchResult.length,
					result: [],
					message: "No record found . . .",
				});
			}
		} catch (error) {
			console.log(error);
		}
	},
	updateInterest: async function (req, res, next) {
		const userEmail = req.userEmail;
		const result = await accountService.updateInterestByEmail(
			userEmail,
			req.body
		);
		if (result === true) {
			res.status(200).json({
				status: "Success",
				message: "Update interest success",
			});
		} else {
			res.status(201).json({
				status: "Failed",
				message: "Update interest failed",
			});
		}
	},
	banAccountForAdminRole: async function (req, res, next) {
		const admin = req.signInAccount;
		if (admin.roleId === 2) {
			try {
				const bannedStatus = 4;
				const result = await accountService.banAccountByAdmin(req.body, 4);
				if (result === true) {
					res.status(200).json({
						status: "Success",
						message: "Ban account success",
					});
				} else {
					res.status(200).json({
						status: "Failed",
						message: "Ban account error",
					});
				}
			} catch (error) {
				console.log(error);
			}
		} else {
			res.status(202).json({
				status: "Failed",
				message: "You have no permission to do this action",
			});
		}
	},
	addPointToAccount: async function (req, res, next) {
		try {
			const emailToAdd = req.body.params.email;
			const point = req.body.params.point;

			const result = await accountService.addPointToAccountByEmail(emailToAdd, point)
			if (result === true) {
				res.status(200).json({
					status: "Success",
					message: `Add ${point} to account ${emailToAdd} successfully`
				})
			} else {
				res.status(202).json({
					status: "Failed",
					message: `Add ${point} to account ${emailToAdd} failed, not found email`
				})
			}
		} catch (error) {
			console.log(error)
		}
	},
	minusPointsToAccount: async function (req, res, next) {
		try {
			const emailToMinus = req.body.params.email;
			const point = req.body.params.point;
			const accountFound = await accountService.findAccountByEmail(emailToMinus)
			if (accountFound.length > 0) {
				if (accountFound[0].point > point) {
					const result = await accountService.minusPointToAccountByEmail(emailToMinus, point)
					if (result === true) {
						res.status(200).json({
							status: "Success",
							message: `Minus points ${point} to account ${emailToMinus} successfully`
						})
					} else {
						res.status(202).json({
							status: "Failed",
							message: `Minus points ${point} to account ${emailToAdd} failed`
						})
					}
				} else {
					res.status(202).json({
						status: "Failed",
						message: "Account don't have enough point to minus"
					})
				}
			} else {
				res.status(202).json({
					status: "Faied",
					message: "Not found account email"
				})
			}
		} catch (error) {
			console.log(error)
		}
	},

	getUserInformation: async function (req, res, next) {
		try {
			//get public subject quan tam, prvate subject quan tam . . .
			const userEmail = req.userEmail;
			const emailForGet = req.body.params.email
			const basicInfor = await accountService.findAccountByEmail(emailForGet)
			if (basicInfor.length > 0) {
				delete basicInfor[0].roleId
				delete basicInfor[0].createdDate
				delete basicInfor[0].point

				const subjectFound = await subjectService.getSubjectUserLearning(emailForGet)
				if (subjectFound.length > 0) {
					res.status(200).json({
						status: "Success",
						basicInfor: basicInfor[0],
						subjectInterest: subjectFound,
						totalSubject: subjectFound.length
					})
				} else {
					res.status(200).json({
						status: "Success",
						basicInfor: basicInfor[0],
						subjectInterest: subjectFound,
						totalSubject: subjectFound.length,
						message: "Account have not start to learning any thing"
					})
				}
			} else {
				res.status(202).json({
					status: "Failed",
					message: "Not found user"
				})
			}
		} catch (error) {
			console.log(error)
		}
	},

};
