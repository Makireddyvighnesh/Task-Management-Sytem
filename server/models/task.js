import mongoose from "mongoose";



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
    },
    priority:{
        type:String,
        default:'p1'
    },
    completed:{
        type:Boolean,
        default:false,
    },
    user_id:{
        type:String,
        required:true
    }
});

const Task=new mongoose.model('Task',taskSchema);

export default Task;