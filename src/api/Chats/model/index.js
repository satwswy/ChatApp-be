import mongoose from "mongoose";

const {Schema, model} = mongoose

const chatSchema = new Schema (
    {
        involved: [{type: Schema.Types.ObjectId, ref:("user"), required: true}],
    },
    {
        timestamps: true
    }
)

export default model("chat", chatSchema)