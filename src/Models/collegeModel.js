const mongoose = require("mongoose")

const collegeSchema = new mongoose.Schema({
    name:{
        type:String,
        required:'College name is required',
        unique:true

    },
    fullName:{
        type:String,
        required:'Fullname is required',
        
    },
    logoLink:{
        type:String,
        required:'Logolink is required',
        trim:true
       
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
})

module.exports = mongoose.model('College', collegeSchema)