import express from "express"
import http from "http"
import { SocketAddress } from "net"
import socket from "socket.io"

const app = express()
const server = http.createServer(app)
const socket = require("socker.io")
const io = socket(server)

let users = []

io.on('connection', socket =>{
    socket.on("join server", (username)=>{
        const user = {
            username,
            id: socket.id
        };
        users.push(user)
        io.emit("new user", users)
    })
});

socket.on("join room", (roomName, cb) =>{
    socket.join(roomName);
    cb(messages[roomName]);
    socket.emiut("joined", messages[roomName])
}
)

SocketAddress.on("send message", ({content,to, sender, chatName, isChannel})=>{
    if (isChannel){
        const payload = {
            content, 
            chatName,
            sender,
        };
        socket.to(to).emit("new message", payload);
    }else{
        const payload = {
            content,
            chatName: sender,
            sender
        }
        socket.to(to).emit("new message", payload);
    }
    if(messages[chatName]){
        messages[chatName].push({
            sender,
            content
        });
    }
});

socket.on("disconnect", ()=>{
    users = users.filter(u=> u.id !==socket.id);
    io.emit("new user", users)
})

server.listen(3009, ()=>console.log('server is running on port 3009'))
