const User = require("../models/user.model.js");
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a Customer
  const user = new User({
    userName: req.body.userName,
    email: req.body.email,
    name: req.body.name,
    password: req.body.password,
    active: req.body.active
  });

  // Save Customer in the database
  User.Create(user, (err, data) => {
    if (err) {
      if (err.kind === "invalid_param") {
        // has been sent but user exists with this name 
        res.status(409).send({
          message: 'User exists with same name'
        });
      }
      res.status(500).send();
    }
    //user has been created 
    else res.status(201).send(data);
  });

};
exports.login = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send();
  }

  User.login(
    req.body.email,
    req.body.password,
    (err, data) => {
      if (err) {
        if (err.kind === "unathorized") {
          //logged in incorrectly sssssssss
          res.status(401).send();
        }
        if (err.kind === "not_found") {
          res.status(409).send();

        } else {
          res.status(500).send();
        }
      } else res.send(data);
    }
  );
};
exports.getAll = (req, res) => {
  User.getAll((err, data) => {
    if (err)
      res.status(500).send();
    else 
    res.status(201).send(data);
  });
}