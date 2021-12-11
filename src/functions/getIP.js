const getClientIP = (adress) => {
    if (adress === undefined) {
        return "unknown";
    }
    else {
        let ip = adress.split(":").pop();
        if (ip === "1") {
            ip = "localhost";
        }
        return ip;
    }
}

module.exports = getClientIP;