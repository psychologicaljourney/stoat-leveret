import ivm from "isolated-vm";
import { evalString, evalTag, isEmpty } from "../util/Util.js";
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
        evalTag(code, msg, this.memLimit);
    }
}