import { User } from "../models/User.js";
import bcrypt from "bcrypt"
export const signup=async(req,res)=>{
    try{
const {email,name,password}=req.body
if(!email || !password || !name){
    return res.status(400).json({message:"Email,password,name all are required"})
}

const existingemail=await User.findOne({email})
if(existingemail)return res.status(400).json({message:"This user already exists! Try logging in"})
    const salt=10;
const password_hash=await bcrypt.hash(password,salt)
    const createuser= await User.create({
email,password_hash,name
})
return res.status(200).json({message:"User created successfully",
    user:{
_id:createuser._id,
name:createuser.name,
email:createuser.email
    },
});
    }
catch(err){
    return res.status(500).json({ message: "Server error" });

}
    };
    export const login=async(req,res)=>{
        try{
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: "email and password is required" });
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User doesnt exist" });
        const ismatch = await bcrypt.compare(password, user.password_hash);
        if (!ismatch) return res.status(400).json({ message: "invalid email or password" });
        res.status(200).json({
            message: "login success",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        });



        }catch(err){
            return res.status(500).json({message:"login unsuccessful"})
        }
    }

