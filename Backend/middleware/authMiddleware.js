import jwt from "jsonwebtoken";


const authMiddleware = (req,res,next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if(!token) return res.status(401).json({message: "No token"});

    try{
     const decode = jwt.verify(token, process.env.JWT_SECRET);
     req.user = decode;
     next();
    }catch{
       res.status(401).json({message: "Invalid Token"});
    }
};

export default authMiddleware;