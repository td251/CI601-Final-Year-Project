const {
    send
} = require('process');
const sql = require("./models/db.js");

var app = require('express')();
var http = require('http').createServer(app);
const PORT = process.env.PORT || 8080;

const io = require("socket.io")(http, {
    cors: {
        origin: ["http://localhost:4200","https://www.quakez.co.uk"],
        methods: ["GET", "POST"],
        credentials: true

    }
});

app.get('/', (req, res) => res.send('HELLO '));



io.on('connection', (socket) => {
    console.log('A user has been connected');
    //connecting a user to a room 
    socket.on('join-chat', id => {
        console.log(id);
        socket.join(id);
        console.log('socket rooms', io.sockets.adapter.rooms);
    })
    //sendiing message 
    socket.on('message', (msg, id, sender) => {
        //escape to avoid mysql injection 
        var sqlCommand = "INSERT INTO Messages(groupID, message,sender) VALUES (" + sql.escape(id) + "," +  sql.escape(msg) + "," + sql.escape(sender) +   ")";
        sql.query(sqlCommand, function (err, res) {
            if (err) {
                throw err;
            }
        })
        // only broadcasty this message to this individual group 
        socket.to(id).broadcast.emit('message-broadcast', {
            //emit message 
            message: msg,
            sender: sender
        });
    });

    socket.on("typing", id => {

        socket.to(id).emit("typing", "someone is typing");
    });
    socket.on("No-Typing", id => {
        socket.to(id).emit("stopped_typing");
    })
});
http.listen(PORT, () => {
    console.log('listening on *:8080 ');
})