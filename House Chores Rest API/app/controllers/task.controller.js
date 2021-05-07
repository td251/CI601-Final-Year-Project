const Task = require("../models/task.model.js");
const e = require("cors");

exports.getTaskById = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "content can not be empty"
    });
  }
  Task.getTaskById(req.params.taskId, (err, data) => {
    if (err) {
      if (err.kind === "conflict") {
        res.status(409).send();
      }
      if (err.kind == "not_found") {
        res.status(404).send();
      } else {
        res.status(500).send();
      }
    } 
    else res.status(201).send(data);
  });
}
exports.getCompletedTasks = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "content can not be empty"
    });
  }
  Task.getCompletedTask(req.params.userAssigned, (err, data) => {
    if (err) {
      if (err.kind === "conflict") {
        //this booking does not exist 
        res.status(409).send();
      } else {
        //error updating the booking 
        res.status(500).send();
      }
    } //Completed tasks has been retrieved 
    else res.status(201).send(data);
  });
}
exports.getToDo = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "content can not be empty"
    });
  }
  Task.getToDo(req.params.userAssigned, (err, data) => {
    if (err) {
      if (err.kind === "conflict") {
        res.status(409).send();
      } else {
        res.status(404).send();
      }
    } 
    else res.status(201).send(data);
  });
}
exports.getInProgress = (req, res) => {

  if (!req.body) {
    res.status(400).send({
      message: "content can not be empty"
    });
  }
  Task.getInProgress(req.params.userAssigned, (err, data) => {
    if (err) {
      if (err.kind === "conflict") {
        res.status(409).send();
      } else {
        res.status(404).send();
      }
    }
    else res.status(201).send(data);
  });
}
exports.getTasks = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "content can not be empty"
    });
  }
  Task.getTasks(req.params.userAssigned, (err, data) => {
    if (err) {
      res.status(500).send();
    } //booking has been updated sucessfully 
    else res.status(201).send(data);
  });
};
exports.getCreatedTasks = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "content can not be empty"
    });
  }
  Task.taskCreated(req.params.createdBy, (err, data) => {
    if (err) {
      if (err.kind == "not_found") {
        res.status(404).send();
      } else
        res.status(500).send();
    }
    else res.status(201).send(data);
  });
}
exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  const task = new Task({
    groupId: req.body.groupId,
    createdBy: req.body.createdBy,
    taskDescription: req.body.taskDescription,
    userAssigned: req.body.userAssigned,
    dateCreated: req.body.dateCreated,
    dateDue: req.body.dateDue,
    taskTitle: req.body.taskTitle,
    priority: req.body.priority,
    dateCompleted: req.body.date,
    taskStatus: req.body.taskStatus,
    approved: req.body.approved,
    reoccuring: req.body.reoccuring

  });
  Task.Create(task, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "error occured when creating the group"
      });
    res.send(data);

  });
};
exports.complete = (req, res) => {
  if (!req.params.taskId) {
    res.status(400);
  }
  Task.taskIsComplete(
    req.params.taskId,
    req.body.complete,
    req.body.dateCompleted,
    (err, data) => {
      if (err) {
        if (err.kind == "conflict") {
          res.status(409).send();

        } else {
          res.status(500).send();
        }
      } else res.status(201).send();
    }

  );

};
exports.delete = (req, res) => {
  if (!req.params.taskId) {
    res.status(400).send({
      message: "content can not be empty"
    });
  } else {
    Task.delete(req.params.taskId, (err, data) => {
      if (err) {
        if (err.kind == "conflict") {
          res.status(409).send();

        } else {
          //fix 
          res.status(500).send();
        }
      } else res.status(201).send(data);
    });

  }
}
exports.updateStatus = (req, res) => {
  if (!req.body.taskId) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  } else {
    Task.updateStatus(req.body.taskId, req.body.status, (err, data) => {
      if (err) {
        if (err.kind == "not_found") {
          res.status(404).send();

        } else {
//send error
          res.status(500).send();
        }
      } else res.status(201).send(data);
    });
  }
}
exports.editTask = (req, res) => {
  if (!req.body.taskId) {
    res.status(400).send({
      message: "content cant be emmpty"
    }).end();
  } else {
    const task = new Task({
      taskId: req.body.taskId,
      groupId: req.body.groupId,
      createdBy: req.body.createdBy,
      taskDescription: req.body.taskDescription,
      userAssigned: req.body.userAssigned,
      dateCreated: req.body.dateCreated,
      dateDue: req.body.dateDue,
      taskTitle: req.body.taskTitle,
      priority: req.body.priority,
      dateCompleted: req.body.date,
      taskStatus: req.body.taskStatus,
      approved: req.body.approved

    });
    Task.editTask(task, (err, data) => {
      if (err) {
        res.status(500).send({
          message: err.message || "error occured when creating the task"
        });
      } else {

        res.status(201).send();
      }
    })
  }
}