const jwt = require("jsonwebtoken");
const middlewareCon ={
    //xacs thuwcj
    verifyToken:(req,res,next) => {
        //const token =req.headers.token
        //PhuongNL21: sửa code
        const token = req.headers.authorization
        console.log(token)
        if(token){
            const accessToken = token.split(" ")[1]
            console.log(`accessToken: ${accessToken}`)
            jwt.verify(accessToken,process.env.ACCESS_TOKEN,(err,user)=>{
                if(err){
                    res.status(403).json("token hết hạn")
                }else{
                    req.user = user
                    next()
                }
                
            })
        }else{
            res.status(401).json("chưa được xác thực")
        }
    },
    verifyTokenAndAdminAuth:(req, res , next) =>{
        middlewareCon.verifyToken(req, res,()=>{
            if(req.user.id == req.params.id || req.user.admin){
                console.log(req.user.id == req.params.id || req.user.admin);
                next()
            }else{
                res.status(403).json("bạn không có quyền xóa")
            }
        })
    }
}
module.exports = middlewareCon