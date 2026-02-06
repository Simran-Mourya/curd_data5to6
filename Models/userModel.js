import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
        userName :{
             type: String,
             required: true
        },
        userEmail: {
            type: String,
            required: true,
            unique: true
        },
        userPassword:{
            type:String,
            required: true,
            unique:true
        },
        createAt:{
            type: Date,
            default:Date.now
        }
});

const userModel = mongoose.model(process.env.MONGODB_COLLECTION, userSchema);
export default userModel;