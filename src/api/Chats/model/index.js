import mongoose from "mongoose";

const {Schema, model} = mongoose

const chatSchema = new Schema (
    {
        involved: [{type: Schema.Types.ObjectId, ref:("user"), required: true}],
        messages: [{type: Schema.Types.ObjectId, ref:("message"), required: false}]
    },
    {
        timestamps: true
    }
)

export default model("chat", chatSchema)