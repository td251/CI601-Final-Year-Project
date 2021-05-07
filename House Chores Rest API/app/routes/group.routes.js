module.exports = app => {
    const groups = require("../controllers/group.controller.js");
    app.post("/groups", groups.create);
    // app.get("/createdGroup", group.);// retrieve created groups
    app.get("/findGroup/:UserCreated", groups.findGroups);
    app.delete("/deleteGroup/:id", groups.delete);
    app.get("/getMembers/:id", groups.getMembers);
    app.get("/groupsAdded/:userName", groups.getUsersGroup);
    app.delete("/leaveGroup/:userName/:groupId", groups.leave);
    app.post("/addmembers", groups.addMembers);
}