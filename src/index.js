const express = require('express');
const cors = require('cors');
const WebSocket = require('ws');
const path = require('path');
const app = express();
const HTTP_PORT = 80;
const SOCKET_PORT = 6644;

const getClientIP = require('./functions/getIP');
const getTime = require('./functions/getTime');

const database = require('./database');





database.createDatabase();
let users = database.getUsers();



const addUser = (username, friends) => {
    database.addUser({
        "username": username,
        "friends": [],
    });
    for (let i = 0; i < friends.length; ++i) {
        database.addConnection(username, friends[i]);
    }
    users = database.getUsers();
    updateUsers(users);
    console.log(`[${getTime()}][Server][Database]: Added New User ${username}`);
};

const addConnection = (username1, username2) => {
    database.addConnection(username1, username2);
    users = database.getUsers();
    updateUsers(users);
    console.log(`[${getTime()}][Server][Database]: Added New Connection ${username1} - ${username2}`);
};

const removeConnection = (username1, username2) => {
    database.removeConnection(username1, username2);
    users = database.getUsers();
    updateUsers(users);
    console.log(`[${getTime()}][Server][Database]: Removed Connection Between ${username1} - ${username2}`);
};





const wss = new WebSocket.Server({ port: SOCKET_PORT });
console.log(`[${getTime()}][Server][WebSocket]: Listening On Port ${SOCKET_PORT}`);

let generalChatUpdate = [];
let usersTrackUpdate = [];

const updateUsers = (users) => {
    for (let i = 0; i < usersTrackUpdate.length; ++i) {
        usersTrackUpdate[i].send(JSON.stringify({type: "Users", users}));
    }
};

wss.on('connection', (socket) => {
    socket.on('message', (message) => {
        message = JSON.parse(message);

        if (message.type === "ListenGeneralChat") {
            console.log(`[${getTime()}][Server][WebSocket]: New Socket Listening For General Chat Updates`);
            generalChatUpdate.push(socket);
        }
        else if (message.type === "ListenUsers") {
            console.log(`[${getTime()}][Server][WebSocket]: New Socket Listening For User Updates`);
            usersTrackUpdate.push(socket);
            socket.send(JSON.stringify({type: "Users", users}));
        }
        else if (message.type === "Login") {
            let exists = false;
            for (let i = 0; i < users.length; ++i) {
                if (users[i]["username"] === message.user) {
                    exists = true;
                    break;
                }
            }
            if (exists) socket.send(JSON.stringify({type: "Login", status: "Username already exists"}));
            else {
                addUser(message.user, []);
                socket.send(JSON.stringify({type: "Login", status: "Correct"}));
            }
        }
        else if (message.type === "AddConnection") {
            addConnection(message.users[0], message.users[1]);
        }
        else if (message.type === "RemoveConnection") {
            removeConnection(message.users[0], message.users[1]);
        }
    });
});





app.use(express.static(path.join(__dirname, "../public/")));
app.use(cors());
app.use(express.json());



app.get('/', (req, res) => {
    console.log(`[${getTime()}][Server][WebServer]: Get Request On ${req.baseUrl}${req.path} From ${getClientIP(req.socket.remoteAddress)}`);
    res.status(200).sendFile(path.join(__dirname, "../public/main/main.html"));
});

app.get('/network', (req, res) => {
    console.log(`[${getTime()}][Server][WebServer]: Get Request On ${req.baseUrl}${req.path} From ${getClientIP(req.socket.remoteAddress)}`);
    res.status(200).sendFile(path.join(__dirname, "../public/network/network.html"));
});

app.use((req, res) => {
    console.log(`[${getTime()}][Server][WebServer]: Request On ${req.baseUrl}${req.path} From ${getClientIP(req.socket.remoteAddress)} -> 404 Response`);
    res.status(404).json({message: "seems like you're lost"});
});



app.listen(HTTP_PORT, () => {
    console.log(`[${getTime()}][Server][WebServer]: Listening On Port ${HTTP_PORT}`);
});