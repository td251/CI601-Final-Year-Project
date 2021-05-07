const Group = require("../models/group.model.js");
exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  const group = new Group({
    UserCreated: req.body.UserCreated,
    GroupStartDate: req.body.GroupStartDate,
    GroupTimeStart: req.body.GroupTimeStart,
    GroupName: req.body.GroupName,
    NumberOfMembers: req.body.NumberOfMembers,
    Description: req.body.Description
  });
  Group.Create(group, (err, data) => {
    if (err){
      res.status(500).send();
    }else 
    res.status(201).send(data);

  });
};
exports.findGroups = (req, res) => {
  Group.findGroups(req.params.UserCreated, (err, data) => {
    if (err) {
      if (err.kind == 'not_found') {
        //return a 404 error 
        res.status(404).send();
      } else {
        //no user 
        res.status(500).send();
      }
      //else user found 
    } else res.status(201).send(data);

  });
};
exports.addMembers = (req, res) => {
  Group.addMembers(req.body.members, req.body.groupId, req.body.GroupName, (err, data) => {
    if (err) {
      if (err.kind == "not found ") {
        //return a 404 error 
        res.status(400).send({
          message: `Not found groups for user:  ${req.params.userName}.`

        });
      } else {
        //no user 
        res.status(201).send({
          message: "Could not find any groups for user:" + req.params.userName
        });
      }
      //else user found 
    } else res.status(201).send();
  });
};
exports.getUsersGroup = (req, res) => {
  Group.getGroupsUsersAddedIn(req.params.userName, (err, data) => {
    if (err) {
      if (err.kind == "not_found") {
        //return a 404 error 
        res.status(400).send();
      } else {
        //no user
        res.status(404).send();
      }
      //else user found 
    } else res.status(201).send(data);

  })
}
exports.leave = (req, res) => {
  Group.leave(req.params.groupId, req.params.userName, (err, data) => {
    if (err) {
      if (err.kind == "not_found") {
        res.status(409).send();
      } else {
        res.status(500).send();
      }
    } else {
      res.status(200).send({
        status: "sucsess",
        message: "Deleted group" + req.params.id
      });
    }
  });
}
exports.delete = (req, res) => {
  Group.remove(req.params.id, (err, data) => {
    if (err) {
      if(err.kind == "not_found"){
        res.status(404).send();
      }
    } else {
      res.status(200).send({
        status: "sucsess",
        message: "Deleted group" + req.params.id
      });
    }
  });
}
exports.getMembers = (req, res) => {
  Group.membersInGroup(req.params.id, (err, data) => {
    if (err) {
      res.status(500).send(); 
    } else {
      res.status(200).send(data);
    }
  })
}