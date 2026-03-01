import { Message, User } from "stoat.js";
import ivm from "isolated-vm";
import logger from "../logger.js";

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

async function evalString(code, memLimit = 8, msg={}, args=""){
    const isolate = new ivm.Isolate({memoryLimit: memLimit});
    const script = isolate.compileScriptSync(code);
    const context = isolate.createContextSync();
    const global = context.global;

    context.global.setSync("msg", new ivm.ExternalCopy(messageToObject(msg)).copyInto());
    context.global.setSync("tag", new ivm.ExternalCopy({"args": args}).copyInto())

    return context.eval(code, {timeout: 15000});
}
/**
 * 
 * @param {String} code 
 * @param {Message} msg 
 * @param {int} memLimit 
 */
async function evalTag(code, msg, args="", memLimit=8){
    if(isEmpty(code)){
        msg.reply("⛔ Can't eval an empty script.");
    }else{
        try{
            const ret = code.includes("return") ? "" : "return";
            let eStr = `function eval(){${ret} ${code}} eval();`;
            evalString(eStr, memLimit, messageToObject(msg), args).then(function(result){
            if(result === undefined){
                msg.reply("⛔ Script returned nothing.");
            }else if(!isEmpty(result.toString())){
                msg.reply(result.toString());
            }else{
                msg.reply("⛔ Script returned nothing.");
            }
        }).catch(function(error){
            msg.reply(`⛔ Encountered exception while running script.\n\`\`\`${error}\`\`\` `);
        });
                    
        }catch(err){
            logger.error(err);
            msg.reply(`⛔ Encountered exception while running script.`);
    
        }
    }
}
/**
 * @param {Message} msg 
 */
function messageToObject(msg){
    return {author: {username: msg.author.username, 
                    discriminator: msg.author.discriminator,
                    avatarURL: msg.author.avatarURL,
                    id: msg.author.id,
                    status: msg.author.status}, 
            content: msg.content, 
            username: msg.username,
            channelId: msg.channelId}
}

function tagData(t_name, body, type, owner){
    return {name: t_name, content: body, type: type, owner: owner};
}
/**
 * @param {String} tag_content 
 * @returns {String}
*/
function cleanScriptTag(tag_content){
    return tag_content.replace("```js ","").replace("```javascript ", "").replace("```","");
}

/**
 * @param {String} tag_content 
 * @returns {String}
*/
function isScriptTag(tag_content){
    return tag_content.includes("```javascript") || tag_content.includes("```js");
}


export {isEmpty, authorToId, evalString, tagData, cleanScriptTag, isScriptTag, evalTag}