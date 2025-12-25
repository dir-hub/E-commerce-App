import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from "../models/userModel.js";
import jwt from 'jsonwebtoken';

const createToken = (id)=>{
    return jwt.sign({id},process.env.JWT_SECRET)
}


const loginUser = async (req,res)=>{
    try {
        const {email,password} = req.body;
        const user = await userModel.findOne({email})
        if(!user){
            return res.json({success:false,message:"User not found"})
        }
        if(!await bcrypt.compare(password,user.password)){
            return res.json({success:false,message:"Incorrect Password"})
        }
        const token = createToken(user._id)
        res.json({success:true,token})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

const registerUser = async (req, res)=>{
    try {
        const {name,email,password} = req.body;

        const exists = await userModel.findOne({email})
        if(exists){
            return res.json({success:false,message:"Email already exists"})
        }

        if(!validator.isEmail(email)){
            return res.json({success:false,message:"Invalid Email"})
        }

        if(!validator.isLength(password,{min:6,max:20})){
            return res.json({success:false,message:"Password should be between 6 to 20 characters"})
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        const newUser = new userModel({
            name,
            email,
            password:hashedPassword
        })

        const user = await newUser.save()

        const token = createToken(user._id)

        res.json({success:true, token})

    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }

}

const adminLogin = async (req, res)=>{
    try {
        const {email,password} = req.body;

        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
            const token = jwt.sign(email+password,process.env.JWT_SECRET)
            res.json({success:true,token})
        }else{
            res.json({success:false,message:"Invalid Credentials"})
        }
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})       
    }
}

const getUserProfile = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await userModel.findById(userId);
        
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        res.json({ 
            success: true, 
            profile: user.profile || {} 
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const updateUserProfile = async (req, res) => {
    try {
        const { userId } = req.body;
        const { firstName, lastName, email, street, city, state, zipcode, country, phone } = req.body;

        const user = await userModel.findById(userId);
        
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        // Update profile fields
        user.profile = {
            firstName: firstName || user.profile?.firstName || '',
            lastName: lastName || user.profile?.lastName || '',
            email: email || user.profile?.email || user.email,
            street: street || user.profile?.street || '',
            city: city || user.profile?.city || '',
            state: state || user.profile?.state || '',
            zipcode: zipcode || user.profile?.zipcode || '',
            country: country || user.profile?.country || '',
            phone: phone || user.profile?.phone || ''
        };

        await user.save();

        res.json({ 
            success: true, 
            message: 'Profile updated successfully',
            profile: user.profile
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export {loginUser,registerUser,adminLogin,getUserProfile,updateUserProfile}