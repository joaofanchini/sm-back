const jwt = require('jsonwebtoken');
const config = require('../config/config.js');

var auth = (req,res, next) =>{
    
    var token_header = req.headers.authorization;
    
    if (!token_header) return res.status(401).send ({error: 'Token não Enviado'});
    
    token_header = token_header.replace('Bearer ','');

    jwt.verify(token_header, config.jwt_pass, (err, decoded)=>{
        
        if (err) return res.status(401).send ({error: 'Token Inválido'});
        
        res.locals.auth_data = decoded;

        return next();
    });
    
}

module.exports = auth;