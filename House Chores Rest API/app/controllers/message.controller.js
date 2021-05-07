const Messages = require("../models/message.model.js");
exports.getMessagesForGroup = (req,res) => {
    if (!req.body) {
        res.status(400).send({
          message: "content can not be empty"
        });
      }
      Messages.getMessageHistory(req.params.groupId, (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            //this booking does not exist 
            res.status(404).send();
          } else {
            //error updating the booking 
            res.status(500).send();
          }
        } //Completed tasks has been retrieved 
        else res.status(201).send(data);
      });
    }