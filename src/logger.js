
const ANSI_RESET = "\u001B[0m";
const ANSI_GREY = "\u001B[90m";
const ANSI_GREEN = "\u001B[32m"
const ANSI_RED = "\u001B[91m";
const ANSI_YELLOW = "\u001B[93m";
const ANSI_BOLD = "\u001B[1m";

function debug(msg){
    log(msg, ANSI_GREY);
}

function info(msg){
    log(msg, ANSI_GREEN);
}

function warn(msg){
    log(msg, ANSI_YELLOW);
}

function error(msg){
    log(msg, ANSI_RED);
}

function log(msg, col = ANSI_RESET){
    console.log(`${getTime(col)} ${msg}`);
}

function getTime(col){
    const d = new Date();
    return `${col}${ANSI_BOLD}[${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}]${ANSI_RESET}`
}


export default { debug, info, warn, error };