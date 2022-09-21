import express from "express";
import chatModel from "../model/index.js"
import usersModel from "../../Users/model/index.js"
import createError from "http-errors"
import { verifyAccessToken } from "../../../lib/auth/acessToken.js";
import { JWTAuthMiddleware } from "../../../lib/auth/token.js";

const chatRouter = express.Router()

chatRouter.get("/", async(req, res, next)=>{
    try{
    const chats = await chatModel.find().populate({path: "involved",select:"username"})//.populate({path:"messages"})
    console.log(chats.length)
    if(chats){
        for(let i=0; i<chats.length; i++){
        if(chats[i].messages){
            console.log("yes")
            chats[i] = await chatModel.find().populate({path:"messages", select:"content"})
        }}
        res.send(chats)
    }else{
        next(createError(404, "there are no chats"))
    }
}catch(error){next(error)}
})

chatRouter.post("/", /*JWTAuthMiddleware,*/async(req,res,next)=>{
    try{
        const newChat = await new chatModel(req.body)
        newChat.involved.map(async user =>{ const involved = await usersModel.findById(user._id)
        involved.chats.push(newChat._id)
        involved.save()})
        newChat.save()
        res.send(newChat)
    }catch(error){next(error)}
})

chatRouter.get("/:chatId", async(req, res, next)=>{
    try{
        console.log(req.params.chatId)
        const message = await chatModel.findById(req.params.chatId).populate({path: "involved", select:"username"})//.populate({path:"messages"})
        console.log(message)
        if(message){
            res.send(message)
        }else(
            next(createError(404, "chat not found"))
        )
    }catch(error){next(error)}
})

export default chatRouter