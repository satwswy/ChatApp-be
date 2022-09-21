import express, { json }  from "express";
import listEndpoints from "express-list-endpoints";
import mongoose from "mongoose";
import cors from "cors"
import chatRouter from "./api/Chats/endpoints/index.js"
import usersRouter from "./api/Users/endpoints/index.js"

const server = express()
const port = process.env.PORT||3003

server.use(cors())
server.use(express.json())

server.use("/users",usersRouter)
server.use("/chat",chatRouter)

mongoose.connect(process.env.MONGO_URL)

mongoose.connection.on("connected", ()=>{
    console.log("mongo connected")
    server.listen(port, ()=>{
        console.table(listEndpoints(server))
        console.log(`Server is listening on port ${port}`)
    })
})