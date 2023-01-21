import {options} from "../config/dbConfig.js";
//const options = require("../config/dbConfig")

// Manager clases
import {Contenedor} from "../managers/contenedorProductos.js";
import {ContenedorChat} from "../managers/contenedorChat.js";
//const ContenedorChat = require("../managers/contenedorChat")
import { ContenedorSQL } from "../managers/contenedorSql.js";
//const ContenedorSQL = require("../managers/contenedorSql")

// Services
//const productosApi = new Contenedor("productos.txt");
export const productosApi = new ContenedorSQL(options.mariaDB, "products");
// const productosApi = new ContenedorSQL(options.mariaDB, "products");
// module.exports = {productosApi} 
export const chatApi = new ContenedorChat("chat.txt");
// chatApi = new ContenedorChat("chat.txt");
// module.exports = {chatApi}
// const chatApi = new ContenedorSQL(dbOptions.sqliteDB, "chat");