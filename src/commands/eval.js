import ivm from "isolated-vm";
import { evalString, isEmpty } from "../util/Util.js";
import logger from "../logger.js";


export default {
    name: "eval",
    alias: ["e"],
    memLimit: 8,
     /**
     * @param {Array} args 
     * @param {Message} msg 
     */
    execute: async function(args, msg){
        const code = args.splice(0).join(' ');
        if(isEmpty(code)){
            msg.reply("⛔ Can't eval an empty script.");
        }else{
            try{
                const ret = code.includes("return") ? "" : "return";
                let eStr = `function eval(){${ret} ${code}} eval();`;
                evalString(eStr, this.memLimit).then(function(result){
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
}