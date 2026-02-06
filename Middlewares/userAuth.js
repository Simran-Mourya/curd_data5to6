import jwt from 'jsonwebtoken'

const userAuth = (req,res,next)=>{
    try {
        let bearerHeader = req.headers['authorization'];
        if(typeof bearerHeader != 'undefined'){
            let token = bearerHeader.split(' ')[1];
            let user = jwt.verify(token,process.env.JWT_SECRET);
            req.token =  user;
            next();
        }
        else{
            res.status(401).json({message: 'Token not set'});
        }
    } catch (error) {
        res.status(403).json({message:'Invalid or expired Token'});
    }
}
export default userAuth;