import e from "express";
import express from "express";
import { productosApi } from "../../services/apiservices.js";

const clientRouter = express.Router();

clientRouter.get("/home",(req,res)=>{
    if(req.session.userName){
        res.render("home", {userName: req.session.userName});
    } else {
        res.redirect("/login")
    }
});

clientRouter.get('/productos',async(req,res)=>{
    res.render('products',{products: await productosApi.getAll()})
});

export {clientRouter};