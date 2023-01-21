import express from "express"
import { Contenedor } from "../managers/contenedorProductos.js"
import { ContenedorSQL } from "../managers/contenedorSql.js"
import { options } from "../config/dbConfig.js";
import { ProductMock } from "../mocks/productsMock.js"

const productRouter = express.Router();

//const productosApi = new Contenedor("productos.txt");
const productosApi = new ContenedorSQL(options.mariaDB, "products");
const productApi = new ProductMock();

productRouter.get('/',async(req,res)=>{
    const productos = await productosApi.getAll();
    res.send(productos);
})

productRouter.get('/:id',async(req,res)=>{
    const productId = req.params.id;
    const product = await productosApi.getById(parseInt(productId));
    if(product){
        return res.send(product)
    } else{
        return res.send({error : 'producto no encontrado'})
    }
})

productRouter.post('/',async(req,res)=>{
    const newProduct = req.body;
    const result = await productosApi.save(newProduct);
    res.send(result);
})

productRouter.post("/generar-productos", (req,res)=>{
    const { cant } = req.query
    let results = productApi.populate(parseInt(cant))
    res.send(results)
})

productRouter.put('/:id',async(req,res)=>{
    const cambioObj = req.body;
    const productId = req.params.id;
    const result = await productosApi.updateById(parseInt(productId),cambioObj);
    res.send(result);
})

productRouter.delete('/:id',async(req,res)=>{
    const productId = req.params.id;
    const result = await productosApi.deleteById(parseInt(productId));
    res.send(result);
})

export { productRouter }