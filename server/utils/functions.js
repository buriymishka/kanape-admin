const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");
const keys = require("../keys/index")

module.exports.createPassword = function (plain) {
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(plain, salt);
  return hash
}

module.exports.generatePassword = function () {
  let length = 8,
    charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    retVal = "";
  for (let i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}

function getMailTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: keys.emailUser,
      pass: keys.emailPassword
    }
  });
}

module.exports.sendRecoverMail = async function (email, newPass) {
  const transporter = getMailTransporter()

  await transporter.sendMail({
    from: 'kanape', // sender address
    to: email, // list of receivers
    subject: 'Восстановление пароля', // Subject line
    html: `Новый пароль: <b>${newPass}</b>`, // html body
  });
}


