const User = require("../model/user")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")


const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none', 
    path: '/',
};

const HandleRegistration = async(req,res)=>{
    try{
        const {fullName,email,password} = req.body
        const existingUser = await User.findOne({email})

        if(existingUser){
            return res.status(400).json({
                success: false,
                message : 'Email already registered'
            })
        }

        const hashedPassword = await bcrypt.hash(password,10)

        const user = await User.create({
            fullName,
            email,
            password: hashedPassword
        })

        res.status(201).json({
            success: true,
            message : "Account created successfully",
            user : {
                id: user._id,
                fullName : user.fullName,
                email: user.email
            }
        })



    }catch(err){
        console.log(err)
        res.status(500).json({ success: false, message: 'Server error' }) 
    }
}


const HandleLogin = async (req,res)=>{
    try{

        const {email,password} = req.body

        const user = await User.findOne({email})

        if(!user){
            return res.status(401).json({
                success:false,
                message:'Invalid email or email not registered'
                })
        }


        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if(!isPasswordCorrect){
            return res.status(401).json({
                success:false,
                message:"Incorrect password"
            })

        }

        const token = jwt.sign(
            {
                userId : user._id,
                email : user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn : '1d'
            }
        )

        res.cookie("token",token,{
            ...cookieOptions,
            maxAge: 24*60*60*1000
        })


        res.status(201).json({
            success:true,
            message: "Login Successful",
            user:{
                id: user._id,
                fullName : user.fullName,
                email : user.email
            }
        })

    }catch(err){
        console.log(err)
        res.status(500).json({
            success:false,
            message:'server error'
        })
    }
}


const HandleLogout = (req,res)=>{

    res.clearCookie("token",cookieOptions)
    res.status(200).json({
        success: true,
        message: "Logout successful"
    })


}




const HandleGetUser = async(req,res)=>{
    try{

        const user = await User.findById(req.user.userId).select('-password')
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }
        res.status(200).json({
            success: true,
            user :{
                id: user._id,
                fullName : user.fullName,
                email: user.email
            }
        })

    }catch(err){
        console.log(err)
        res.status(500).json({
            success:false,
            message: "Server error"
        }
        )
    }
}

module.exports = {HandleRegistration, HandleLogin, HandleGetUser, HandleLogout}