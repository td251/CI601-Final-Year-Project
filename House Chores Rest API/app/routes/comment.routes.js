module.exports = app => {
    const comments = require("../controllers/comment.controller.js");

    app.post("/createComment", comments.create);
    app.get("/getCommentsForTask/:taskId", comments.getComment);
}