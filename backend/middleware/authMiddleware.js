const jwt = require('jsonwebtoken')

const AuthMiddleware = (req,res,next)=>{
    try{

        const token = req.cookies?.token
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Not authenticated"
            })
        }

        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        req.user = decoded
        next()


    }catch(err){
        console.log(err)
        res.status(500).json({
            success:false,
            message:"Server error"
        })
    }
}

module.exports = AuthMiddleware