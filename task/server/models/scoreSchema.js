import mongoose from "mongoose";

const scoreSchema = mongoose.Schema({
    username: {
        type: String, required: true
    },
    result: {
        type: Array, default: [], required: true,
    },
    /* attempts : { 
         type : Number, 
         default : 0
     },*/
    score: {
        type: Number, default: 0, required: true
    },
}, { timestamps: true })

export default mongoose.model('result', scoreSchema);