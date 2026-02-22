import { User } from "stoat.js";

/**
 * @param {String} str 
 * @returns {String}
 */
function isEmpty(str){
    return (str == "" || str == " ")
}

/**
 * @param {User} author 
 * @returns {String}
 */
function authorToId(author){
    return `${author.username}#${author.discriminator}`;
}

export {isEmpty, authorToId}