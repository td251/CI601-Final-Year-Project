module.exports = app => {
    const messages = require("../controllers/message.controller.js");
    app.get("/messages/:groupId", messages.getMessagesForGroup);
}