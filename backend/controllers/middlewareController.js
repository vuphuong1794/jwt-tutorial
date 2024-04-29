const jwt = require("jsonwebtoken");
const { createdError } = require("../utils/error");

const middlewareController= {
    verifyToken: (req, res, next)=>{
        const token = req.headers.token;
        if(token){
            const accessToken = token.split(" ")[1]
            jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user)=>{
                if(err){
                    return next(createdError(403, "Token is not valid!"));
                }
                req.user=user;
                next();
            })
        }else{
            return next(createdError(401, "You are not authenticated!"));
        }
    },

    verifyTokenAndAdminAuth: (req, res, next)=>{
        middlewareController.verifyToken(req, res, ()=>{
            if(req.user.id == req.params.id || req.user.admin){
                next()
            }else{
                res.status(403).json("You're not allowed to delete other");
            }
        })
    }
}

module.exports = middlewareController