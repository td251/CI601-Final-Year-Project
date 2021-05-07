const sql = require("./db.js");
const reoccuringTask = function (task) {
    console.log(task);
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
        this.reoccuring = task.reoccuring
};

//checking for daily tasks 
reoccuringTask.dailyTaskUpdate = function dailyTaskUpdate() {
    var sqlCommand = "select * from reoccuring_tasks where occurence_id = 1"
    sql.query(sqlCommand,function(err,result){
        console.log(result[0]);
        for(var i = 0; i < res.affectedRows; i++ )
        {

        }
    })
}
 reoccuringTask.weeklyTaskUpdate = function weeklyTaskUpdate()
 {
    var sqlCommand = "select * from reoccuring_tasks where occurence_id = 2"
    sql.query(sqlCommand,function(err,result){
        console.log(result[0]);
    })
 }
 reoccuringTask.monthlyTaskUpdate = function monthlyTaskUpdate()
 {
    var sqlCommand = "select * from reoccuring_tasks where occurence_id = 2"
    sql.query(sqlCommand,function(err,result){
        console.log(result[0]);
    })

 }
 //check for weekly task 
 //check for monthly task

module.exports = reoccuringTask;