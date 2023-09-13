import mongoose from "mongoose";

const setDefault=()=>{
    
        const now = new Date();
        const curr=new Date(now.getTime() + 12 * 60 * 60 * 1000);;
        console.log(typeof(curr), "called")
        return curr;
        
      
}

const taskSchema=new mongoose.Schema({
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

const Task=mongoose.model('Task',taskSchema);


export default Task;