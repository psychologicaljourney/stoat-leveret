import logger from "../logger.js";
import Database from "better-sqlite3";
import { isEmpty } from "./Util.js";

const tagdb = new Database("./src/db/tags.db", {fileMustExist: true});

function initDB(){
    //tagdb.exec("DROP TABLE tags;")
    tagdb.exec("CREATE TABLE IF NOT EXISTS tags(tag_name TEXT PRIMARY KEY, content TEXT NOT NULL, owner TEXT NOT NULL, type TEXT NOT NULL)");
}

function getTag(tag_name){
    if(tagExists(tag_name))
        return tagdb.prepare(`SELECT content FROM tags WHERE tag_name='${tag_name}'`).get();
    return undefined
}


function tagExists(tag_name){
    const exists = tagdb.prepare(`SELECT EXISTS(SELECT 1 FROM tags WHERE tag_name='${tag_name}') AS row_exists`).get()
    
    return (exists.row_exists == 1);
}

function addTag(tag_name, content, owner, type="tag"){
    tagdb.exec(`INSERT INTO tags (tag_name, content, owner, type) VALUES ('${tag_name}', '${content}', '${owner}', '${type}');`);
}

function editTag(tag_name, new_content){
    tagdb.exec(`UPDATE tags SET content = '${new_content}' WHERE tag_name='${tag_name}'`)
}

function deleteTag(tag_name){
    if(tagExists(tag_name))
        tagdb.exec(`DELETE FROM tags WHERE tag_name='${tag_name}'`);
}

function ownsTag(tag_name, owner){
    if(!tagExists(tag_name))
        return undefined
    return (getOwner(tag_name) == owner)
}

function getOwner(tag_name){
    if(tagExists(tag_name))
        return tagdb.prepare(`SELECT owner FROM tags WHERE tag_name='${tag_name}'`).get().owner;
    return undefined;
}

function searchTags(query){
    if(isEmpty(query))
        return undefined;
    const result = tagdb.prepare(`SELECT tag_name FROM tags WHERE tag_name LIKE '%${query}%'`).all();
    return result;
}

function getDatabase(){
    return tagdb;
}


export {getDatabase, initDB, getTag, addTag, tagExists, getOwner, searchTags, editTag, deleteTag, ownsTag}