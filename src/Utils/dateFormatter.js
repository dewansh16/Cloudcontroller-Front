
// 02:00:00 - 26, May 2021
const timeAndDate = (value) => {
    let newDate = new Date(value);
    newDate = newDate.toUTCString().split(' ');
    return `${newDate[newDate.length - 2]} - ${newDate[1]}, ${newDate[2]} ${newDate[3]}`

}


export { timeAndDate }