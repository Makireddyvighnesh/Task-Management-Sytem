import mongoose from "mongoose";

const filterSchema=new mongoose.Schema({
    state:{
        type:Boolean,
        default:false
    },
});

const Filter=mongoose.model('Filter',filterSchema);

// const state= new Filter({
//     state:false
// })
// state.save();
export default Filter;