module.exports = app => {
    const tasks = require("../controllers/task.controller.js");
    app.post("/tasks", tasks.create);
    app.get("/usersTask/:userAssigned", tasks.getTasks);
    app.get("/tasksCreated/:createdBy", tasks.getCreatedTasks);
    app.get("/getTaskById/:taskId", tasks.getTaskById);
    app.put("/taskIsComplete/:taskId", tasks.complete);
    app.get("/completedTasks/:userAssigned", tasks.getCompletedTasks);
    app.put("/updateStatus", tasks.updateStatus);
    app.get("/getInToDo/:userAssigned", tasks.getToDo);
    app.get("/getInProgress/:userAssigned", tasks.getInProgress);
    app.put("/editTask/", tasks.editTask)
    app.delete("/deleteTask/:taskId", tasks.delete);
}