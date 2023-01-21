//const path = require("path");
import path from "path";
import { fileURLToPath } from "url";
//const __dirname = path.dirname(fileURLToPath(import.meta.url));

const __dirname = path.dirname(fileURLToPath(import.meta.url))


const options = {
    mariaDB:{
        client:"mysql",
        connection:{
            host:"127.0.0.1",
            user:"root",
            password:"",
            database:"ecommerce"
        }
    },
    sqliteDB:{
        client:"sqlite3",
        connection:{
            filename: path.join(__dirname, "../DB/chatDB.sqlite")
        }
    },
    mongoDBAtlas:{
        mongoUrl: "mongodb+srv://mef1991:35480618@fonsecabackend.n7owdzj.mongodb.net/sessionDB?retryWrites=true&w=majority"
    
    }
}

//module.exports = options;

export {options}