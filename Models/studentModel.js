import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
     _id:{
        type:Number,
        required:true,
        unique:true,
     },
     student_name:{
        type: String,
        required:true
     },
     student_email:{
        type:String,
        unique:true,
        required:true
     },
     student_age:{
        type:Number,
        required: true,
     },
      student_phone:{
        type:Number,
        required: true,
        unique:true
     },
      student_gender:{
        type:String,
        required: true,
        enum:['Male', 'Female', 'other']
     },
      student_photo:{
        type:String,
        required: true,
     } 
});

const studentModel = mongoose.model(process.env.MONGODB_COLLECTION2, studentSchema);
export default studentModel;