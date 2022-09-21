import express from "express"
import createError from "http-errors"
import usersModel from "../model/index.js"
import {createAccessToken, verifyAccessToken} from "../../../lib/auth/acessToken.js"
import multer from "multer"
import {CloudinaryStorage } from "multer-storage-cloudinary"
import {v2 as cloudinary } from "cloudinary"
import { JWTAuthMiddleware } from "../../../lib/auth/token.js"

const usersRouter = express.Router()

const cloudinaryUploader = multer({
    storage: new CloudinaryStorage({
      cloudinary, 
      params: {
        folder: "whatsapp/users",
      },
    }),
    limits: { fileSize: 1024 * 1024 },
  }).single("avatar");

usersRouter.post("/", async (req,res,next)=>{
    try{
        const newUser = await new usersModel(req.body)
        newUser.save()
        res.status(201).send(newUser._id)
    }catch(error){
        next(error)
    }
})
usersRouter.get("/", async (req, res, next) => {
    try{
        const user = await usersModel.find()//.populate({ref:"chat"})
        res.send(user)
    } catch(error){
        next(error)
    }
})
usersRouter.get("/me", JWTAuthMiddleware ,async(req, res, next) =>{
    try{
        console.log("user_id",req.user._id)
        const foundUser = await usersModel.findById(req.user._id)
        if(foundUser){
        res.send(foundUser)
    }else{
        next(createError(404,"user not found"))
    }
    }catch (error){
        next(error)
    }
})

usersRouter.get("/:userId", async(req,res,next)=>{
    try{
        const foundUser = await usersModel.findById(req.params.userId)//.populate({ref: "chat"})
        if(user){
        res.send(foundUser)}
        else{
            next(createError(404,"user not found"))
        }
    }catch(error){
        next(error)
    }
})



usersRouter.put("/me",JWTAuthMiddleware, async(req,res, next) =>{
    try{
        console.log(req.user._id)
        const user = await usersModel.findByIdAndUpdate(req.user._id, req.body, {new: true, runValidators: true})
        user.save()
        if(user){
        res.send(user)
    }else{
        console.log(user)
        next(createError(404, "user not found"))
    }
    }catch (error){
        next(error)
    }
})

usersRouter.delete("/me",JWTAuthMiddleware, async(req, res, next) =>{
    try{
        console.log("here")
        console.log(req.user._id)
        await usersModel.findByIdAndDelete(req.user._id)
        console.log("here")
        res.send(`deleted user `)
    }catch(error){
        next(error)
    }
})

usersRouter.post("/me/avatar",JWTAuthMiddleware, cloudinaryUploader, async (req,res, next) =>{
    try{
        const user = await usersModel.findById(req.user._id)
        console.log("found user")
        if(user){
            console.log(req.file.path)
            user.avatar = req.file.path
            user.save()
            res.send(user.avatar)
        }else{
            next(createError(404, "user not found"))
        }
    }catch(error){
        next(error)
    }
})

usersRouter.post("/login", async (req, res, next)=>{
    try{
    const email = req.body.email
    const password = req.body.password

    const user = await usersModel.checkCredentials(email, password)

    if(user){
        console.log(user)
        const token = await createAccessToken({_id: user._id})
        res.send({acessToken: token})
    }else{
        next(createError(401, "bad credentials"))
    }}catch(error){
        next(error)
    }
})

//usersRouter.post("/logout",verifyAcessToken, async (req, res, next)=>{
//    try{
//        const user = 
//    }
//})

export default usersRouter