const sql = require("./db.js");
const nodemailer = require("nodemailer");

let transport = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    service: "Gmail",
    auth: {
        user: "housechoresv6",
        pass: "forReportPurposes"
    }
});
const taskCreationMessage = {
    from: 'housechoresv6@gmail.com', // Sender address
    to: '', // List of recipients
    subject: 'You have been assigned a task!', // Subject line
    text: '' // Plain text body
};
const {
    getTasks,
    create
} = require("../controllers/task.controller.js");

const Task = function (task) {
        this.task_id = task.taskId,
        this.user_assigned = task.userAssigned,
        this.created_by = task.createdBy,
        this.group_id = task.groupId,
        this.date_created = task.dateCreated
        this.date_due = task.dateDue,
        this.priority = task.priority,
        this.task_description = task.taskDescription,
        this.task_title = task.taskTitle,
        this.complete = task.complete,
        this.task_status = task.taskStatus,
        this.approved = task.approve,
        this.reoccuring_id = task.reoccuring
};
Task.Create = async function create(task, result) {
    if (task.priority == null) {
        task.priority = 1;
    }
    if (task.priority == 'Medium') {
        task.priority = 2;
    } else if (task.priority == 'High') {
        task.priority = 3;
    } else if (task.priority == 'Low') {
        task.priority = 1;
    }
    // if task is set to be reocceuring 
    if (task.reoccuring != null || task.reoccuring != 'No') {
        var taskIsReoccuring = true;
    }
    //on creation of task set approved to false
    task.approved = 0;
    //on creation of task set status to TO DO 
    task.task_status = 0;
    //sending creation email
    getEmail(task.user_assigned, task.created_by, task.taskDescription);
    sql.query("INSERT INTO tasks SET?", task, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        //before sending result to client send task id to the reoccuring table with the reocceuring val
        if (taskIsReoccuring == true) {
            updateReoccurinTable(res.insertId, task.reoccuring_id);
        }
        result(err, {
            id: res.insertid,
            ...task
        });
    });

}

async function updateReoccurinTable(taskId, reoccuringValue) {
    var val = 0;
    if (reoccuringValue == "Daily") {
        val = 1;
    } else if (reoccuringValue == "Weekly") {
        val = 2;
    } else if (reoccuringValue == "Monthly") {
        val = 3;
    }
    var sqlCommand = "INSERT INTO reoccuring_tasks(task_id, occurence_id) VALUES (" + sql.escape(taskId) + "," + val + ")";
    sql.query(sqlCommand, function (err, res) {
        if (err) {
            console.log(err);
        }
    })
}
Task.getTasks = (userAssigned, result) => {
    sql.query(`SELECT * FROM tasks WHERE user_assigned = ` + sql.escape(userAssigned) + 
        ` And complete IS NULL AND task_status IS NULL ORDER BY date_due DESC`, (err, res) => {
            if (err) {
                result(err, null);
                return;
            }
            //rows have been found with same username 
            if (res.length > 0) {
                result(null, res);
                return;
            }
            //no rows have been found with this username 
            result({
                kind: "not_found"
            }, null);
            return;
        });
}
Task.taskCreated = (createdBy, result) => {
    sql.query(`select * from tasks where created_by = ` + sql.escape(createdBy) + ` ORDER BY date_created DESC`, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        if (res.length > 0) {
            result(null, res);
            return;
        }
        result({
            kind: "not_found"
        }, null);
        return;
    });
}
Task.delete = (taskId, result) => {
    sql.query(`DELETE from tasks where Id = ${taskId} `, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        if (res.affectedRows == 0) {
            // not found Customer with the id
            result({
                kind: "not_found"
            }, null);
            return;
        }
        //booking has been updated 
        result(null, {
            id: taskId,

        })
    });
}
Task.updateStatus = (taskId, status, result) => {
    sql.query(` UPDATE tasks set task_status =` + sql.escape(status) + `WHERE Id = ` + sql.escape(taskId), (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        if (res.affectedRows == 0) {
            // not found Customer with the id
            result({
                kind: "not_found"
            }, null);
            return;
        }
        //booking has been updated 
        result(null, {
            id: taskId,

        })

    });
}
Task.editTask = async function edit(task, result) {
    if (task.priority == null) {
        task.priority = 1;
    }
    if (task.priority == 'Medium') {
        task.priority = 2;
    } else if (task.priority == 'High') {
        task.priority = 3;
    } else if (task.priority == 'Low') {
        task.priority = 1;
    }
    //on creation of task set approved to false
    task.approved = 0;
    //on creation of task set status to TO DO 
    task.taskStatus = 0;
    console.log(task.task_id);
    // naybe send a notice saying it has been updated 
    sql.query(`UPDATE tasks SET task_status = '${task.taskStatus}', date_due= '${task.date_due}', priority = '${task.taskStatus}', task_title = '${task.tassk_title}', task_description = '${task.task_description}' WHERE Id = ${task.task_id} `, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        if (res.affectedRows == 0) {
            // not found Customer with the id
            result({
                kind: "not_found"
            }, null);
            return;
        }
        //booking has been updated 
        result(null, {
            id: task.taskId,

        })
    })
}
//retriving the users email 
async function getEmail(user, asignee, description) {
    sql.query(`select * from users where userName  =` + sql.escape(user), (err, res) => {
        if (err) {
            console.log(err);
        } else {
            //semdomg the email and asignee name to the send email funciton 
            sendTaskEmail(res[0].email, asignee, user);
        }

    })
}
//sending the task email 
async function sendTaskEmail(email, asignee, user) {
    //the reciever of the email 
    taskCreationMessage.to = email;
    taskCreationMessage.text = `Hi ${user},
    you have been assigned a task by ${asignee} check House Chores now to see what it is!
    https://www.quakez.co.uk/app-login`
    transport.sendMail(taskCreationMessage, function (err, info) {

        if (err) {
            console.log(err)
        } else {
            console.log(info);
        }
    });
}
Task.getTaskById = (taskId, result) => {
    sql.query(` select * from tasks where Id = ` + sql.escape(taskId), (err, res) => {
        if (err) {
            console.log(err);
            result(err, null);
            return;
        }
        if (res.affectedRows == 0) {
            // not this task
            result({
                kind: "not_found"
            }, null);
            return;
        }
        //task has been sucessfully found
        result(null, res)
        return;
    });
}
Task.taskIsComplete = (taskId, complete, dateCompleted, result) => {
    sql.query(`UPDATE tasks set complete = 1, date_completed = ` + sql.escape(dateCompleted) + `WHERE Id =` + sql.escape(taskId), (err, res) => {
        if (err) {
            console.log(err);
            result(err, null);
            return;
        }
        if (res.affectedRows == 0) {
            // not found Customer with the id
            result({
                kind: "not_found"
            }, null);
            return;
        }

        result(null, {
            id: taskId,
            complete: complete,
            ...complete
        })
    });
}
Task.getCompletedTask = (userAssigned, result) => {
    sql.query(`SELECT * FROM tasks where user_assigned = ` + sql.escape(userAssigned) + ` AND complete = 1 ORDER BY date_completed DESC`, (err, res) => {
        if (err) {
            console.log(err);
            result(err, null);
            return;
        }
        if (res.length == 0) {
            // not found Customer with the id
            result({
                kind: "not_found"
            }, null);
            return;
        } else {
            result(null, res);
            return;
        }
    });
}
//get tasks that are currently assighned as to do 
Task.getToDo = (userAssigned, result) => {
    sql.query(`SELECT * FROM tasks where user_assigned = ` + sql.escape(userAssigned) + ` AND task_status = 1 ORDER BY date_completed DESC`, (err, res) => {
        if (err) {
            console.log(err);
            result(err, null);
            return;
        }
        if (res.length == 0) {
            // not found Customer with the id
            result({
                kind: "not_found"
            }, null);
            return;
        } else {
            result(null, res);
            return;
        }
    });
}
Task.getInProgress = (userAssigned, result) => {
    sql.query(`SELECT * FROM tasks where user_assigned =` + sql.escape(userAssigned) + ` AND task_status = 2 ORDER BY date_completed DESC`, (err, res) => {
        if (err) {
            console.log(err);
            result(err, null);
            return;
        }
        if (res.length == 0) {
            // not found Customer with the id
            result({
                kind: "not_found"
            }, null);
            return;
        } else {
            result(null, res);
            return;
        }
    });
}
module.exports = Task;