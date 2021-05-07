const Comment = require("../models/comment.model.js");
exports.create = (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

//fix 
    const comment = new Comment({
        commentContent: req.body.commentContent,
        creationDate: req.body.creationDate,
        commentCreator: req.body.commentCreator,
        taskId: req.body.taskId
    });
    Comment.Create(comment, (err, data) => {
        if (err)
            res.status(500).send({
                message: err.message || "error occured when creating the group"
            });
        res.send(data);

    });
}
exports.getComment = (req, res) => {
    if (!req.params) {
        res.status(400).send({
            message: "content can not be empty"
        });
    }
    Comment.getCommentsForTask(req.params.taskId, (err, data) => {
        if (err) {
            if (err.kind === "conflict") {
                //this booking does not exist 
                res.status(409).send();
            } else if (err.kind == "not_found") {
                //no comments for this task found 
                res.status(404).send();
            } else {
                //error getting the comments
                res.status(500).send();
            }
        } //booking has been updated sucessfully 
        else res.status(201).send(data);
    });
};