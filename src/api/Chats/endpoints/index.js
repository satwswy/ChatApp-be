import express from "express";
import chatModel from "../model/index.js"
import usersModel from "../../Users/model/index.js"
import createError from "http-errors"
import { verifyAccessToken } from "../../../lib/auth/acessToken.js";

const chatRouter = express.Router()

chatRouter.get("/", async(req, res, next)=>{
    try{
    const chats = await chatModel.find().populate({path: "user",select:"username"})
    if(chats){
        res.send(chats)
    }else{
        next(createError(404, "there are no chats"))
    }
}catch(error){next(error)}
})

chatRouter.post("/", verifyAccessToken,async(req,res,next)=>{
    try{
        const newChat = await new chatModel(req.body)
        res.send(newChat)
    }catch(error){next(error)}
})

chatRouter.get("/:chatId", async(req, res, next)=>{
    try{
        const message = chatModel.findById(req.params.chatId).populate({path: "user", select:"username"})
        if(message){
            res.send(message)
        }else(
            next(createError(404, "message not found"))
        )
    }catch(error){next(error)}
})

export default chatRouter