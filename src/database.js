const path = require('path');
const fs = require('fs');

const indexOfCallback = (array, callback) => {
    for (let i = 0; i < array.length; ++i) {
        if (callback(array[i])) return i;
    }
    return -1;
};

const createDatabase = () => {
    if (!fs.existsSync(path.join(__dirname, "../database/users.json"))) {
        fs.writeFileSync(path.join(__dirname, "../database/users.json"), JSON.stringify({"users": []}));
    }
};

const getUsers = () => {
    let data = fs.readFileSync(path.join(__dirname, "../database/users.json"));
    data = JSON.parse(data);
    return data['users'];
};

const addUser = (user) => {
    let users = getUsers();
    users.push(user);
    fs.writeFileSync(path.join(__dirname, "../database/users.json"), JSON.stringify({users}));
};

const addConnection = (user1, user2) => {
    let users = getUsers();
    let index1 = indexOfCallback(users, user => user["username"] === user1);
    let index2 = indexOfCallback(users, user => user["username"] === user2);
    users[index1].friends.push(user2);
    users[index2].friends.push(user1);
    fs.writeFileSync(path.join(__dirname, "../database/users.json"), JSON.stringify({users}));
};

const removeConnection = (user1, user2) => {
    let users = getUsers();
    let index1 = indexOfCallback(users, user => user["username"] === user1);
    let index2 = indexOfCallback(users, user => user["username"] === user2);
    users[index1].friends.splice(indexOfCallback(users[index1].friends, user => user === user2), 1);
    users[index2].friends.splice(indexOfCallback(users[index2].friends, user => user === user1), 1);
    fs.writeFileSync(path.join(__dirname, "../database/users.json"), JSON.stringify({users}));
};

module.exports = {
    createDatabase,
    getUsers,
    addUser,
    addConnection,
    removeConnection,
};