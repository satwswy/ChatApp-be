import express from "express";
import chatModel from "../../Chats/model/index.js"
import messageModel from "../model/index.js"
import createError from "http-errors"
import { verifyAccessToken } from "../../../lib/auth/acessToken.js";
import { JWTAuthMiddleware } from "../../../lib/auth/token.js";

const messageRouter = express.Router()

messageRouter.post("/", /*JWTAuthMiddleware,*/async(req,res,next)=>{
    try{
        const newMessage = await new messageModel(req.body)
        const newChat = await chatModel.findById(newMessage.chat)
        console.log(newChat)
        newMessage.save()
        newChat.messages.push(newMessage._id)
        newChat.save()
        res.send(newMessage)
    }catch(error){next(error)}
})

export default messageRouter