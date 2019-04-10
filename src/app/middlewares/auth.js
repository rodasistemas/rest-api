const jwt = require("jsonwebtoken");
const authConfig = require("../../config/auth.json");

module.exports = (req,res,next)=>{
    const authHeaders = req.headers.authorization;
    if(!authHeaders)
        return res.status(401).send({error:'No Token Provided'});
    
    const parts = authHeaders.split(' ');

    if(!parts === 2)
        return res.status(401).send({error:'Token Error'});
    
    const [ scheme, token ] = parts;

    if(!/^Bearer$/i.test(scheme))
        return res.status(401).send({error:'Token Malformed'});
    
    jwt.verify(token, authConfig.secret, (err, decoded)=>{
        if(err) return res.status(401).send({error:'Token Invalid'});

        req.userId = decoded.id;
        return next();
    });
}