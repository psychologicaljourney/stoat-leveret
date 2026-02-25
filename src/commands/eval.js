import ivm from "isolated-vm";
import { isEmpty } from "../util/Util.js";
import logger from "../logger.js";


export default {
    name: "eval",
    alias: [],
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
                const isolate = new ivm.Isolate({memoryLimit: this.memLimit});
                const script = isolate.compileScriptSync(code);
                const context = isolate.createContextSync();
                const result = context.eval(code).then(function(result){
                    logger.debug(result);
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