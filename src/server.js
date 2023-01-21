import express from "express"
import session from "express-session"
import MongoStore from "connect-mongo"
import cookieParser from "cookie-parser"
import { options } from "./config/dbConfig.js"
import { productRouter } from "./routes/products.js"
import handlebars from "express-handlebars"
import { Server } from "socket.io"
import { normalize, schema } from "normalizr"
import { Contenedor } from "./managers/contenedorProductos.js"
import {ContenedorChat} from "./managers/contenedorChat.js"
import {ContenedorSQL} from "./managers/contenedorSql.js"
import path from "path"
import {fileURLToPath} from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import { clientRouter } from "./routes/web/clientRoutes.js"
import { authRouter } from "./routes/web/authRoutes.js"
//service
// const productosApi = new Contenedor("productos.txt");
const productosApi = new ContenedorSQL(options.mariaDB, "products");
const chatApi = new ContenedorChat("chat.txt");
//const chatApi = new ContenedorSql(options.sqliteDB,"chat");

//server
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname+'/public'))

//configuracion template engine handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname+'/views');
app.set('view engine', 'handlebars');

//configuracion de sesion
app.use(cookieParser())
app.use(session({
    store: MongoStore.create({
        mongoUrl: options.mongoDBAtlas.mongoUrl
    }),
    secret: "claveSecreta",
    resave: false,
    saveUninitialized: false,
    cookie:{
        maxAge: 60000 //10min.
    }
}))

//normalizacion
//creamos los esquemas
//esquema del autor
const authorSchema = new schema.Entity("authors",{}, {idAttribute: "email"})

//esquema del msj
const messageSchema = new schema.Entity("messages",{author:authorSchema})

//esquema global p/ nuevo objeto
const chatSchema = new schema.Entity("chat",{
    messages:[messageSchema]
}, {idAttribute: "id"})

//aplicamos la normalizacion
//crear una funcion para normalizar la data
const normalizarData = (data)=>{
    const normalizeData = normalize({id:"chatHistory",messages:data}, chatSchema)
    return normalizeData
}

const normalizarMensajes = async() =>{
    const results = await chatApi.getAll()
    const messagesNormalized = normalizarData(results)
    //console.log(JSON.stringify(messagesNormalized,null,"\t"))
    return messagesNormalized
}
normalizarMensajes()

// routes
//view routes
//app.get('/', async(req,res)=>{
//     res.render('home')
// })

//app.get('/productos',async(req,res)=>{
//     res.render('products',{products: await productosApi.getAll()})
// })

//api routes
app.use('/api/products',productRouter)
//view routes
app.use(clientRouter)
app.use(authRouter)


//express server
const server = app.listen(8080,()=>{
    console.log('listening on port 8080')
})


//websocket server
const io = new Server(server);

//configuracion websocket
io.on("connection",async(socket)=>{
    //PRODUCTOS
    //envio de los productos al socket que se conecta.
    io.sockets.emit("products", await productosApi.getAll())

    //recibimos el producto nuevo del cliente y lo guardamos con filesystem
    socket.on("newProduct",async(data)=>{
        await productosApi.save(data);
        //despues de guardar un nuevo producto, enviamos el listado de productos actualizado a todos los sockets conectados
        io.sockets.emit("products", await productosApi.getAll())
    })

    //CHAT
    //Envio de todos los mensajes al socket que se conecta.
    io.sockets.emit("messages", await normalizarMensajes());

    //recibimos el mensaje del usuario y lo guardamos en el archivo chat.txt
    socket.on("newMessage",async(newMsg)=>{
        console.log(newMsg)
        await chatApi.save(newMsg);

        io.sockets.emit("messages", await normalizarMensajes());
    })
}) 