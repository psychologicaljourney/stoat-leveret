import { User } from "stoat.js";
import ivm from "isolated-vm";

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

/**
 * @param {String} code 
 * @returns {Promise<Any>}
 */

async function evalString(code, memLimit = 8){
    const isolate = new ivm.Isolate({memoryLimit: memLimit});
    const script = isolate.compileScriptSync(code);
    const context = isolate.createContextSync();
    return context.eval(code);
}

function tagData(t_name, body, type, owner){
    return {name: t_name, content: body, type: type, owner: owner};
}

export {isEmpty, authorToId, evalString, tagData}