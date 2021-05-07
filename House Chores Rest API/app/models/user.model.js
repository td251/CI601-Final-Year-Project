const sql = require("./db.js");
var bcrypt = require('bcryptjs');
const nodemailer = require("nodemailer");

let transport = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: 2525,
  service: "Gmail",
  auth: {
    user: "housechoresv6",
    pass: "removedForReportPurposes"
  }
});
const registerMessage = {
  from: 'housechoresv6@gmail.com', // Sender address
  to: '', // List of recipients
  subject: 'Welcome to house chores', // Subject line
  text: '' // Plain text body
};

const User = function (user) {
  this.userName = user.userName;
  this.email = user.email;
  this.name = user.name;
  this.password = user.password;
  this.active = user.active
};

User.getAll = (result, reject) => {
  sql.query("SELECT userName FROM users;", (err, res) => {
    if (err) {
      console.log('error', err);
      return (err);
    }
    console.log("UserNames", res);
    result(null, res);
  })
}
//make async 
async function checkEmail(newUser, result) {
  return new Promise(function check(resolve, reject) {
    sql.query(`SELECT * FROM users WHERE email =` + sql.escape(newUser.email), (err, res) => {
      console.log(res.length);
      if (res.length > 0) {
        resolve(true);
      } else {
        resolve(false);
      }

    })
  });
}
async function sendRegisterEmail(newUser) {
  registerMessage.to = newUser.email;
  registerMessage.text = `Hi ${newUser.name}, welcome to the House Chore application your user name is ${newUser.userName}, enjoy the House Chores App! 
  Tyler `;

  transport.sendMail(registerMessage, function (err, info) {
    console.log("Hello");

    if (err) {
      console.log(err)
    } else {
      console.log(info);
    }
  });
}
async function checkUsers(newUser) {
  return new Promise(function check(resolve, reject) {
    sql.query(`SELECT * FROM users WHERE username =` + sql.escape(newUser.userName), (err, res) => {
      console.log(res.length);
      if (res.length > 0) {
        resolve(true);
      } else {
        resolve(false);
      }
    })
  });
}
User.Create = async function create(newUser, result) {
  console.log(newUser);
  var userNameCheck = await checkUsers(newUser);
  var emailCheck = await checkEmail(newUser);
  console.log(userNameCheck + emailCheck);
  if (userNameCheck == true || emailCheck == true) {
    console.log("true");
    //already exists
    result({
      kind: "invalid_param"
    }, null);
    return;
  }
  await sendRegisterEmail(newUser);
  //encrypt password 
  bcrypt.hash(newUser.password, 10, function (pwErr, hash) {
    //hash the password 
    newUser.password = hash;
    console.log(newUser);

    sql.query("INSERT INTO users SET ?", newUser, (err, res) => {

      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      newUser.active = 1;
      result(err, {
        id: res.insertId,
        ...newUser
      });
    });
  });
};
User.login = (email, password, result) => {
  // add bytecrypt to encrypt password
  sql.query(`SELECT * FROM users WHERE email =`+ sql.escape(email), (err, res) => {
    console.log("TESTING");
    console.log(res.length);
    if (res.length > 0) {
      if (!bcrypt.compareSync(password, res[0].password)) {
        result({
          kind: "unathorized"
        }, null);
        return;
      } else {
        //otherwise suer can sign in 
        result(null, {
          email: email
        });
      }
    } else {
      //otherwise cant find user 
      result({
        kind: "not_found"
      }, null);
      return;
    }
  });
}
module.exports = User;