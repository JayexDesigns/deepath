const SOCKET_PORT = 6644;

const loginForm = document.getElementById("login-form");
const loginInput = document.getElementById("login-username");

var loggedIn = false;
var username = "";
var users = [];

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
        }
        else showAlert(message.status);
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