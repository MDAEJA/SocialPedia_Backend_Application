const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config({path:'../config.env'})
const authMiddleware = async(res,res,next)=>{
    try{
        let token = req.header("Authorization");
  if(!token){
    return res.status(403).json({
        status: false,
        message : "Access Denied !!"
    })
  };
  if(token.startsWith("Bearer ")){
    token = token.slice(7,token.length).trimLeft();
  }

  const verifyToken = jwt.verify(token,process.env.JWT_TOKEN);
  if(!verifyToken){
    return res.status(403).json({
        status: false,
        message : "Invalid Token"
    })
  };

  next();

    }
    catch(err){
        res.status(500).json({
            status: false,
            message : err.message
        })
    }
}

module.exports = authMiddleware;