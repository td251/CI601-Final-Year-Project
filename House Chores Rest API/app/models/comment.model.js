const sql = require("./db.js");
const Comment = function (comment) {
    this.comment_id = comment.commentId,
        this.comment_content = comment.commentContent,
        this.creation_date = comment.creationDate,
        this.comment_creator = comment.commentCreator,
        this.taskId = comment.taskId
};
Comment.Create = async function (comment, result) {
    sql.query("INSERT INTO comments SET?", comment, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        console.log("created comment", {
            id: res.insertid,
            ...comment
        });
        result(err, {
            id: res.insertid,
            ...comment
        });
    });
}
Comment.getCommentsForTask = (taskId, result) => {
    sql.query(`SELECT * FROM comments where taskId = `+ sql.escape(taskId), (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        if (res.length == 0) {
            result({
                kind: "not_found"
            }, null);
            return;
        } else {
            result(null, res);
            return;

        }
    })
}
module.exports = Comment;