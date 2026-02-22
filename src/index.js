import { Client } from "stoat.js";
import logger from "./logger.js";
import fs from "node:fs";
import path from "node:path";
import { initDB } from "./util/Database.js";

let client = new Client();
let commands = {};

function loadCommands(){
    try{
        commands = {};
        const files = fs.readdirSync("./src/commands/").filter(file => file.endsWith('.js'));
        for(const file of files){
            import(`./commands/${file}`).then((command) =>{
                logger.info(`Loaded command: ${command.default.name}`);
                commands[command.default.name] = command.default
                for(const alias of command.default.alias){  
                    commands[alias] = command.default
                }
            }).catch((e) =>{
                logger.error(e);
            });
            
        }

    }catch (e){
        logger.error(e);
    }
}

initDB();
loadCommands();

client.on("ready", async () =>{
    logger.info(`Logged in as ${client.user.username}`);
    client.user.status = ""; 
});

client.on("messageCreate", async (msg) =>{
    if(msg.content.startsWith('%')){
        const args = msg.content.toLowerCase().split(' ');
        args[0] = args[0].slice(1)
        const command = args.shift()
        if(commands[command] !== undefined){
            await commands[command].execute(args, msg);
        }
    }
});



client.loginBot(process.env.TOKEN);
