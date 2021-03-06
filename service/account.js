const db = require('./db');
const helper = require('../helper');
const config = require('../config');
const { accountMessage } = require('../lang/vi');
const mailer = require('../mailer')
const uuidv4 = require("uuid/v4")
const bcrypt = require('bcrypt');

//demo
async function getAllUser(page = 1) {
  const offset = helper.getOffset(page, config.listPerPage);
  const sql = `SELECT 
    email,
    fullName,
    roleId,
    statusId,
    phone,
    address,
    DOB,
    gender,
    createdDate,
    point,
    donorPoint
  FROM tbl_account where roleId != 2 `;
  // limit ? offset ?
  // const params = [`${config.listPerPage}`, `${offset}`]
  // const rows = await db.query(sql, params);
  const rows = await db.query(sql);

  const data = helper.emptyOrRows(rows);
  // const meta = { page, total: data.length };
  const meta = { total: data.length };

  return {
    data,
    meta
  }
}




//checkLogin
async function checkLogin(loginObject) {
  // const sql = `SELECT email,
  //   password,
  //   fullName,
  //   roleId,
  //   statusId,
  //   phone,
  //   address,
  //   DOB,
  //   gender,
  //   createdDate
  //   FROM tbl_account
  //   WHERE email = ? and password = ?`;
  // const params = [`${username}`, `${password}`]
  // const rows = await db.query(sql, params);
  // const data = helper.emptyOrRows(rows);
  ///////////////////////////////////////////////
  const sql = `SELECT email,
    password,
    fullName,
    roleId,
    statusId,
    phone,
    address,
    DOB,
    gender,
    createdDate,
    interestTopic,
    point,
    donorPoint
    FROM tbl_account
    WHERE email = ? `;
  const params = [`${loginObject.params.email}`]
  const rows = await db.query(sql, params);
  const data = helper.emptyOrRows(rows);
  if (data.length > 0) {
    let valid = await bcrypt.compare(loginObject.params.password, data[0].password);
    if (valid) {
      return data
    }
  }
  return []
}

async function updateRefreshToken(email, token) {
  const sql = `UPDATE tbl_account
   set refreshToken = ? 
   where email = ?`
  const params = [`${token}`, `${email}`]
  const result = await db.query(sql, params)

  if (result.affectedRows) {
    return true
  }
  return false;

}

//find
async function findAccountByRefreshToken(token) {
  const sql = `SELECT email,
    fullName,
    roleId,
    statusId,
    phone,
    address,
    DOB,
    gender,
    createdDate,
    point,
    donorPoint
    FROM tbl_account
    WHERE refreshToken = ?`;
  const params = [`${token}`]
  const rows = await db.query(sql, params);
  const data = helper.emptyOrRows(rows);
  return data;
}

//Register account
async function registerAccount(accountToRegister, protocol, host) {

  if (accountToRegister.params.roleId === 1 || accountToRegister.params.roleId === '1') {
    const sql = ` INSERT INTO 
  tbl_account(email,
    password,
    fullName,
    roleId,
    statusId,
    phone,
    address,
    DOB,
    createdDate,
    gender,
    verifyToken, 
    interestTopic) values(?,?,?,?,?,?,?,?,?,?,?,?)`;

    //get current datetime
    let current = new Date();
    let cDate = current.getFullYear() + '-' + (current.getMonth() + 1) + '-' + current.getDate();
    let cTime = current.getHours() + ":" + current.getMinutes() + ":" + current.getSeconds();
    let dateTime = cDate + ' ' + cTime;


    //encrypt password
    const saltRounds = 7;
    const salt = bcrypt.genSaltSync(saltRounds);  // encrypt password
    const encryptPassword = bcrypt.hashSync(accountToRegister.params.password, salt);

    //generate token
    const verifyToken = uuidv4();

    //genegrate topic
    const topicsId = accountToRegister.params.interestTopic
    //generate values for insert
    const params = [
      `${accountToRegister.params.email}`,
      `${encryptPassword}`,
      `${accountToRegister.params.fullName}`,
      `${accountToRegister.params.roleId}`,
      `${1}`,
      `${accountToRegister.params.phone}`,
      `${accountToRegister.params.address}`,
      `${accountToRegister.params.DOB}`,
      `${dateTime}`,
      `${accountToRegister.params.gender}`,
      `${verifyToken}`,
      `${JSON.stringify(topicsId)}`
    ]

    //query
    const result = await db.query(sql, params)

    if (result.affectedRows) {

      //generate linkVerify
      let linkVerify = `${protocol}://${host}/account/verify/${verifyToken}`;
      let subject = "You has create an account on FC website, please verify";
      let body = `
    <h2>B???n nh???n ???????c email n??y v?? ???? ????ng k?? t??i kho???n tr??n ???ng d???ng FC.</h2>
    <h3>Vui long click v??o li??n k???t b??n d?????i ????? x??c nh???n k??ch ho???t t??i kho???n: </h3>
    <h3>
    Nh???n v??o ????y: <a href="${linkVerify}" target="_blank" >Click here</a>
    </h3>
    <h4>Vui l??ng kh??ng reply. Tr??n tr???ng !</h4>
    `

      //sendEmail
      mailer.sendMail(accountToRegister.params.email, subject, body).catch(error => {
        console.log(error.message)
      })
      return accountMessage.register_success;
    } else {
      return accountMessage.register_error;
    }
  } else if (accountToRegister.params.roleId === 3 || accountToRegister.params.roleId === '3') {
    const sql = ` INSERT INTO 
    tbl_account(email,
      password,
      fullName,
      roleId,
      statusId,
      phone,
      address,
      DOB,
      createdDate,
      gender,
      verifyToken) values(?,?,?,?,?,?,?,?,?,?,?)`;

    //get current datetime
    let current = new Date();
    let cDate = current.getFullYear() + '-' + (current.getMonth() + 1) + '-' + current.getDate();
    let cTime = current.getHours() + ":" + current.getMinutes() + ":" + current.getSeconds();
    let dateTime = cDate + ' ' + cTime;


    //encrypt password
    const saltRounds = 7;
    const salt = bcrypt.genSaltSync(saltRounds);  // encrypt password
    const encryptPassword = bcrypt.hashSync(accountToRegister.params.password, salt);

    //generate token
    const verifyToken = uuidv4();

    //genegrate topic
    const topicsId = accountToRegister.params.interestTopic
    //generate values for insert
    const params = [
      `${accountToRegister.params.email}`,
      `${encryptPassword}`,
      `${accountToRegister.params.fullName}`,
      `${accountToRegister.params.roleId}`,
      `${1}`,
      `${accountToRegister.params.phone}`,
      `${accountToRegister.params.address}`,
      `${accountToRegister.params.DOB}`,
      `${dateTime}`,
      `${accountToRegister.params.gender}`,
      `${verifyToken}`
    ]

    //query
    const result = await db.query(sql, params)

    if (result.affectedRows) {

      //generate linkVerify
      let linkVerify = `${protocol}://${host}/account/verify/${verifyToken}`;
      let subject = "You has create an account on FC website, please verify";
      let body = `
      <h2>B???n nh???n ???????c email n??y v?? ???? ????ng k?? t??i kho???n tr??n ???ng d???ng FC.</h2>
      <h3>Vui long click v??o li??n k???t b??n d?????i ????? x??c nh???n k??ch ho???t t??i kho???n: </h3>
      <h3>
      Nh???n v??o ????y: <a href="${linkVerify}" target="_blank" >Click here</a>
      </h3>
      <h4>Vui l??ng kh??ng reply. Tr??n tr???ng !</h4>
      `

      //sendEmail
      mailer.sendMail(accountToRegister.params.email, subject, body).catch(error => {
        console.log(error.message)
      })
      return accountMessage.register_success;
    } else {
      return accountMessage.register_error;
    }
  } else {
    //error reg
    return false
  }
}

//verify account
async function verifyAccountByEmailToken(verifyToken) {
  const sql = `SELECT email, verifyToken 
  from tbl_account 
  where verifyToken = ? and statusId = 1`;
  const params = [`${verifyToken}`];
  const rows = await db.query(sql, params);
  const data = helper.emptyOrRows(rows);
  return data

}

async function updateAccountStatus(email, status) {
  const sql = `UPDATE tbl_account SET statusId = ? where email = ?`;
  const params = [`${status}`, `${email}`]
  const result = await db.query(sql, params)
  if (result.affectedRows) {
    return true;
  } else {
    return false;
  }
}

//update account in profile manage
async function updateAccountInformation(accountParams) {
  const account = accountParams.params;
  try {
    const sql = `UPDATE tbl_account 
    set 
    fullName = ?,
    phone = ?,
    address = ?,
    DOB = ?,
    gender = ?
    where email = ?`;
    const params = [
      `${account.fullName}`,
      `${account.phone}`,
      `${account.address}`,
      `${account.DOB}`,
      `${account.gender}`,
      `${account.email}`,
    ]

    const result = await db.query(sql, params)
    if (result.affectedRows) {
      return true
    } else {
      return false
    }
  } catch (error) {
    console.log(error)
    return {
      error: error.message
    }
  }
}

async function getPasswordByEmail(email) {
  try {
    const sql = `SELECT password from tbl_account where email = ?`;
    const params = [`${email}`]
    const rows = await db.query(sql, params);
    const data = helper.emptyOrRows(rows);
    return data;
  } catch (error) {
    console.log(error)
    return error.message
  }
}
//change password 
async function changePassword(email, newPassword) {
  try {
    let saltRounds = 7;
    let salt = bcrypt.genSaltSync(saltRounds);  // encrypt password
    let encryptPassword = bcrypt.hashSync(newPassword, salt);

    const sql = `UPDATE tbl_account set password = ? where email = ?`;
    const params = [`${encryptPassword}`, `${email}`]
    const result = await db.query(sql, params);
    if (result.affectedRows) {
      return true
    } else {
      return false
    }
  } catch (error) {
    console.log(error);
    return {
      error: error.message
    }
  }

}



async function findAccountByEmail(emailSearchValue) {
  try {
    const sql = `SELECT 
    email,
    fullName,
    roleId,
    statusId,
    phone,
    address,
    DOB,
    gender,
    createdDate,
    interestTopic,
    point,
    donorPoint
    FROM tbl_account 
    WHERE email = ? and statusId != 4`
    const params = [`${emailSearchValue}`]
    const rows = await db.query(sql, params)
    const data = helper.emptyOrRows(rows)
    return data;
  } catch (error) {
    console.log(error.message)
  }
}

async function updateInterestByEmail(email, listId) {
  const listTopicId = listId.params.interestTopic
  try {
    const sql = `update tbl_account set interestTopic = ? where email = ?`
    const params = [
      `${JSON.stringify(listTopicId)}`,
      `${email}`
    ]
    const result = await db.query(sql, params);
    if (result.affectedRows) {
      return true
    } else {
      return false
    }

  } catch (error) {
    console.log(error)
  }
}

async function banAccountByAdmin(banInfor, status) {
  try {
    const sql = `UPDATE tbl_account SET statusId = ?, adminDescription= ? where email = ?`;
    const params = [
      `${status}`,
      `${banInfor.params.adminDescription}`,
      `${banInfor.params.email}`
    ]
    const result = await db.query(sql, params)
    if (result.affectedRows) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error)
  }
}

async function addPointToAccountByEmail(account, point) {
  try {
    const sql = `update tbl_account set point = (point + ?) where email = ?`;
    const params = [
      point,
      `${account}`
    ]
    const result = await db.query(sql, params);
    if (result.affectedRows) {
      return true
    } else {
      return false
    }

  } catch (error) {
    console.log(error)
  }
}

async function minusPointToAccountByEmail(account, point) {
  try {
    const sql = `update tbl_account set point = (point - ?) where email = ?`;
    const params = [
      point,
      `${account}`
    ]
    const result = await db.query(sql, params);
    if (result.affectedRows) {
      return true
    } else {
      return false
    }

  } catch (error) {
    console.log(error)
  }
}

async function addDonorPointToDonor(account, donorPoint) {
  console.log(account, donorPoint)
  try {
    const sql = `update tbl_account set donorPoint = (donorPoint + ?) where email = ?`;
    const params = [
      donorPoint,
      `${account}`
    ]
    const result = await db.query(sql, params);
    if (result.affectedRows) {
      return true
    } else {
      return false
    }

  } catch (error) {
    console.log(error)
  }
}

async function minusDonorPoint(account, donorPoint) {
  try {
    const sql = `update tbl_account set donorPoint = (donorPoint - ?) where email = ?`;
    const params = [
      donorPoint,
      `${account}`
    ]
    const result = await db.query(sql, params);
    if (result.affectedRows) {
      return true
    } else {
      return false
    }

  } catch (error) {
    console.log(error)
  }
}

async function addAccumulatedPoint(accountId, point) {
  try {
    const sql = `Update tbl_account set accumulatedPoint = (accumulatedPoint + ?) where email = ? `
    const params = [
      `${point}`,
      `${accountId}`
    ]
    const result = await db.query(sql, params)
    if (result.affectedRows) {
      return true
    } else {
      return false
    }
  } catch (error) {
    console.log(error)
  }
}

async function minusAccumulatedPoint(accountId, point) {
  try {
    const sql = `Update tbl_account set accumulatedPoint = (accumulatedPoint - ?) where email = ? `
    const params = [
      `${point}`,
      `${accountId}`
    ]
    const result = await db.query(sql, params)
    if (result.affectedRows) {
      return true
    } else {
      return false
    }
  } catch (error) {
    console.log(error)
  }
}

async function getAccumulatedPoint(accountId) {
  try {
    const sql = `select accumulatedPoint from tbl_account where email  = ?`
    const params = [
      `${accountId}`
    ]
    const result = await db.query(sql, params);
    const data = helper.emptyOrRows(result)

    return data

  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  getAllUser,
  checkLogin,
  registerAccount,
  verifyAccountByEmailToken,
  updateRefreshToken,
  findAccountByRefreshToken,
  updateAccountInformation,
  getPasswordByEmail,
  changePassword,
  findAccountByEmail,
  updateInterestByEmail,
  updateAccountStatus,
  banAccountByAdmin,
  addPointToAccountByEmail,
  minusPointToAccountByEmail,
  addDonorPointToDonor,
  minusDonorPoint,

  getAccumulatedPoint,
  addAccumulatedPoint,
  minusAccumulatedPoint
}