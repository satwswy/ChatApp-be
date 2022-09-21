import jwt from "jsonwebtoken";

export const createAccessToken = payload =>
new Promise((resolve, reject)=>
jwt.sign(payload, process.env.JWT, {expiresIn: "4 hours"}, (error, token)=>{
    if(error) reject(error)
    else resolve(token)
}))

export const verifyAccessToken = token =>{
return new Promise ((res, rej) =>
jwt.verify(token,process.env.JWT, (error, payload)=>{
    if(error){
        console.log(error)
        rej(error)
    }
    else res(payload)
}))}

