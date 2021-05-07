const sql = require("./db.js");

const Message = function(message)
{
    this.groupID = message.groupID, 
    this.message = message.message, 
    this.sender = message.sender
}
Message.getMessageHistory = (groupId, result) => {
    sql.query(`SELECT * FROM messages where groupID = ` + sql.escape(groupId), (err, res) => {
        if (err) {
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
module.exports = Message;