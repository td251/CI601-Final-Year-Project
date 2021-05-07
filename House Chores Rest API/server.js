// require ('newrelic');
const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
const app = express();
const cron = require('node-cron');
const ReoccuringTask = require('./app/models/reoccuringTasks.model.js');

cron.schedule('* * * * *', function(){
  ReoccuringTask.weeklyTaskUpdate(); 
})
// parse requests of content-type: application/json
app.use(bodyParser.json());
//emabling all cors request 
app.use(cors());
// parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: true
}));

// simple route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Tylers rest api."
  });
});

// set port, listen for requests                
const PORT = process.env.PORT || 3000;
// conencting routes to the servre 
require("./app/routes/user.routes.js")(app);
require("./app/routes/group.routes.js")(app);
require("./app/routes/task.route.js")(app);
require("./app/routes/comment.routes")(app);
require("./app/routes/message.routes")(app);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});