import mongoose from "mongoose";

const {Schema, model} = mongoose

const messageSchema = new Schema({
    content:{
        text : {type: String, required: false},
        media: {type: String, required: false},},
    sender : {type: Schema.Types.ObjectId, ref: "user", required: true},
    chat: {type: String, required: true}
},
{
    timestamps: true
})

export default model("message", messageSchema)