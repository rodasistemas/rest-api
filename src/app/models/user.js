const mongoose = require("../../database");
const bcryptjs = require("bcryptjs");
const UserSchema = mongoose.Schema({
    name:{
        type: String,
        require:true,
    },
    email:{
        type: String,
        require:true,
        unique:true,
        lowercase:true,
    },
    password:{
        type: String,
        require: true,
        select: false,
    },
    passwordResetToken:{
        type: String,
        select: false
    },
    passwordResetExpires:{
        type: Date,
        select: false
    },
    createAt:{
        type: Date,
        default: Date.now,
    },
});

UserSchema.pre('save', async function(next){
    const hash = await bcryptjs.hash(this.password,10);
    this.password = hash;
});

const User = mongoose.model('User', UserSchema);

module.exports = User;