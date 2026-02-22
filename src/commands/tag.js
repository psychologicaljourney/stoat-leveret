import { Message } from "stoat.js";
import logger from "../logger.js";
import { authorToId, isEmpty } from "../util/Util.js";
import { addTag, deleteTag, editTag, getOwner, getTag, ownsTag, searchTags, tagExists } from "../util/Database.js";


export default {
    name: "tag",
    alias: ["t"],
    /**
     * @param {Array} args 
     * @param {Message} msg 
     */
    execute: async function(args, msg) {
        if(args[0] == "add"){
            const content = args.splice(2).join(' ');
            if(isEmpty(content)){
                msg.reply(`⚠️ Tag body is empty.`);
            }else if(tagExists(args[1])){
                msg.reply(`⚠️ Tag **${args[1]}** already exists, and is owned by \`${getOwner(args[1])}\``);
            }else{
                addTag(args[1], content, `${msg.author.username}#${msg.author.discriminator}`);
                msg.reply(`✅ Created tag ${args[1]}`);
            }
        
        }else if(args[0] == "owner"){
            const owner = getOwner(args[1])
            if(owner === undefined){
                msg.reply(`⚠️ Tag **${args[1]}** doesn't exist.`);
            }else{
                msg.reply(`ℹ️ Tag **${args[1]}** is owned by \`${owner}\``);
            }
        }else if(args[0] == "search"){
            const result = searchTags(args[1]);
            if(result.length < 1){
                msg.reply(`ℹ️ Found **no** similar tags.`);
            }else{
                const tags = result.map(r => `**${r.tag_name}**`);
                msg.reply(`ℹ️ Found **${result.length}** similar tags: ${tags.join(", ")}`);
            }
        }else if(args[0] == "edit"){
            const content = args.splice(2).join(' ');
            if(!tagExists(args[1])){
                msg.reply(`⚠️ Tag **${args[1]}** doesn't exist.`);
            }else if(!ownsTag(args[1], authorToId(msg.author))){
                msg.reply(`⚠️ You can only edit your own tags. and is owned by \`${getOwner(args[1])}\`.`);
            }else if(isEmpty(content)){
               msg.reply(`⚠️ Tag body is empty.`);
            }else{
                editTag(args[1], content);
                msg.reply(`✅ Edited tag **${args[1]}**.`);
            }

        }else if(args[0] == "delete" || args[0] == "del"){
            if(isEmpty(args[1])){
                msg.reply(`ℹ️ %tag **delete** \`name\``);
            }else if(!tagExists(args[1])){
                msg.reply(`⚠️ Tag **${args[1]}** doesn't exist.`);
            }else if(!ownsTag(args[1], authorToId(msg.author))){
                msg.reply(`⚠️ You can only delete your own tags. and is owned by \`${getOwner(args[1])}\`.`);
            }else{
                deleteTag(args[1]);
                msg.reply(`✅ Deleted tag ${args[1]}`);
            }
        }else if(!isEmpty(args[0])){ // %t [name]
            const t = getTag(args[0]);
            if(t === undefined){
                msg.reply(`⚠️ Tag **${args[0]}** doesn't exist.`);
            }else {
               msg.reply(getTag(args[0]));
            }
        }
    }
    
}