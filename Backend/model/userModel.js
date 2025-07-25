import mongoose from "mongoose";

const userSchema=new mongoose.Schema(
    {
        fullName:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true
        },
        phone:{
            type:Number,
        },
        password:{
            type:String,
            required:true
        },
        role:
        {
            type:String,
            enum:['student','recruiter']
        },
        profile :
        {
            bio :{
                type:String
            },
            file :{
                type:String,
                default :" "
            },
            resume:{
                type:String,
                default :""
            }

        }
        ,
        createdAt: {
            type: Date,
            default: Date.now,
    }

    }
)
export const User=mongoose.model('User',userSchema)