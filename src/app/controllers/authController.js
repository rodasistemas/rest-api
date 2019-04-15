const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require('../models/user');
const authConfig = require("../../config/auth.json");
const mailer = require("../../modules/mailer");

const router = express.Router();

function generateToken(params = {}){
    return jwt.sign(params, authConfig.secret,{
        expiresIn: 86400,
    });
}
router.post('/register',async (req,res) =>{
    const { email } = req.body;
    try{
        if ( await User.findOne({ email }))
            return res.status(400).send({error: 'User already exists.'});
        const user = await User.create(req.body);
        user.password = undefined;
        return res.send({
            user,
            token: generateToken({id: user.id})
        });
    } catch(err){
        return res.status(400).send({error: 'Registration Failed'});
    }
});
router.post('/authenticate', async (req,res)=>{
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if(!user)
        return res.status(400).send({error:'User not found.'});
    if(! await bcrypt.compare(password,user.password))
        return res.status(400).send({error:'Incorrect password.'});
    user.password = undefined;
    res.send({
        user, 
        token: generateToken({id: user.id})
        });
});
router.post('/forgot-password', async (req,res)=>{
    const { email } = req.body;
    try{
        const user = await User.findOne({email});
        if(!user)
            res.status(400).send({error: "User not found!"});
        const token = crypto.randomBytes(20).toString('hex');
        const now = new Date();
        now.setHours(now.getHours()+1);
        await User.findOneAndUpdate(user.id,{
            '$set':{
                passwordResetToken: token,
                passwordResetExpires:now
            }
        });
        mailer.sendMail({
            to: email,
            template:"/auth/forgot-password",
            subject: "Sending Email using Node.js",
            context: {token}
        }, (err)=>{
            if(err){
                return res.status(400).send({error: 'Cannot send forgot password, try again'});
            
            }else{
                return res.status(200).send({success: 'Token to Forgot Password send success!'});
            }
            
        });

    }catch(err){
        
        res.status(400).send({error:"Error on recovery password, try again"});
    }
});

module.exports = app => app.use('/auth', router);