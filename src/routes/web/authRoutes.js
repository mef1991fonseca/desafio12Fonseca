import express from "express";

const authRouter = express.Router();

authRouter.get("/",(req,res)=>{
    res.redirect("/home")
});

authRouter.get("/login",(req,res)=>{
    if(req.session.userName){
        res.redirect("home");
    } else{
        res.render("login");
    }
});

authRouter.post("/login",(req,res)=>{
    const {name} = req.body;
    // console.log("name", name);
    if(name){
        req.session.userName = name;
        res.redirect("/home");
    } else{
        res.render("login",{error:"por favor ingresa el usuario"});
    }
});

authRouter.get("/logout",(req,res)=>{
    const name = req.session?.userName;
    if(name){
        req.session.destroy(error=>{
            if(!error){
                return res.render("logout", {name:name});
            } else{
                res.redirect("/home")
            }
        });
    } else{
        res.redirect("/home");
    }
});

export {authRouter};