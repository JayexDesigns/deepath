const SOCKET_PORT = 6644;

const loginForm = document.getElementById("login-form");
const loginInput = document.getElementById("login-username");

var loggedIn = false;
var username = "";
var users = [];
var chatHistory = [];

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    username = loginInput.value;
    if (username === "") showAlert("The username field can not be empty");
    else ws.send(JSON.stringify({type: "Login", user: username}));
});



const parseUsers = (users) => {
    let container = document.getElementById("friends-container");
    container.innerHTML = ``;
    for (let i = 0; i < users.length; ++i) {
        if (users[i]["username"] !== username) {
            let isFriend = false;
            for (let j = 0; j < users[i]["friends"].length; ++j) {
                if (users[i]["friends"][j] === username) isFriend = true;
            }
            if (isFriend) container.innerHTML += `<li><p>${users[i]["username"]}</p><button onclick="removeFriend('${users[i]["username"]}')">REMOVE</button></li>`;
            else container.innerHTML += `<li><p>${users[i]["username"]}</p><button onclick="addFriend('${users[i]["username"]}')">ADD</button></li>`;
        }
    }
};

const addFriend = (user) => {
    ws.send(JSON.stringify({type: "AddConnection", users: [username, user]}));
};

const removeFriend = (user) => {
    ws.send(JSON.stringify({type: "RemoveConnection", users: [username, user]}));
};



const parseChat = (chatHistory) => {
    let chat = document.getElementById("chat-container");
    chat.innerHTML = ``;
    for (let i = 0; i < chatHistory.length; ++i) {
        chat.innerHTML += `<li class="message"><b>${chatHistory[i]["username"]}: </b><p>${chatHistory[i]["message"]}</p></li>`;
    }
    chat.scrollTop = chat.scrollHeight;
};

document.getElementById("chat-form").addEventListener('submit', (e) => {
    e.preventDefault();
    if (loggedIn) {
        let message = document.getElementById("chat-input").value;
        if (message === "") showAlert("The message can not be empty");
        else {
            ws.send(JSON.stringify({type: "AddMessage", username, message}));
            document.getElementById("chat-input").value = "";
        }
    }
    else showAlert("First you'll need to login");
});



const ws = new WebSocket(`ws://${location.host}:${SOCKET_PORT}`);

ws.onopen = () => {
    ws.send(JSON.stringify({type: "ListenGeneralChat"}));
    ws.send(JSON.stringify({type: "ListenUsers"}));
}

ws.onmessage = (event) => {
    let message = JSON.parse(event.data);

    if (message.type === "Login") {
        if (message.status === "Correct") {
            loggedIn = true;
            document.getElementById("login").remove();
            parseUsers(users);
            parseChat(chatHistory);
        }
        else showAlert(message.status);
    }
    else if (message.type === "Chat") {
        chatHistory = message.chatHistory;
        if (loggedIn) parseChat(chatHistory);
    }
    else if (message.type === "Users") {
        users = message.users;
        if (loggedIn) parseUsers(users);
    }
}



let currentAlertTimeout;
const showAlert = (text) => {
    if (currentAlertTimeout) {
        clearTimeout(currentAlertTimeout);
    }
    let alertElement = document.getElementById("alert");
    alertElement.innerText = text;
    alertElement.style.opacity = "1";
    alertElement.style.bottom = "3%";
    currentAlertTimeout = setTimeout(() => {
        alertElement.style.opacity = "0";
        alertElement.style.bottom = "-20%";
        currentAlertTimeout = undefined;
    }, 3000);
}