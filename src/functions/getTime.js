const getTime = () => {
    let date = new Date;
    let hours = (date.getHours().toString().length < 2) ? `0${date.getHours()}` : date.getHours();
    let minutes = (date.getMinutes().toString().length < 2) ? `0${date.getMinutes()}` : date.getMinutes();
    let time = `${hours}:${minutes}`;
    return time;
}

module.exports = getTime;