import mongoose from "mongoose";

const setDefault=()=>{
    
        const now = new Date();
        const curr=new Date(now.getTime() + 12 * 60 * 60 * 1000);;
        console.log(typeof(curr), "called")
        return curr;
        
      
}

const resetSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        default:'',
    },
    dueDate:{
        type:Date,
        default: setDefault(),
    },
    priority:{
        type:String,
        default:'p1'
    },
    completed:{
        type:Boolean,
        default:false,
    },
});

const Reset=mongoose.model('Reset',resetSchema);


export default Reset;