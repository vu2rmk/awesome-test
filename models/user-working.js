// acquiring all the packages

var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bcrypt = require("bcrypt-nodejs");

// user schema
var UserSchema = new Schema({
    
    name: String,
    username:{type:String,required:true,unique:{index:true}},
    password:{type:String,required:true,select:false}
});

// hashing the password before saving
UserSchema.pre('save',function(next){
    
    var user = this;
    // hashing the password only when there is a modification
    if(!user.isModified('password')) return next();
    
    // hash the password
    bcrypt.hash(user,null,null,function(err,hash){
        
        if(err) return next(err);
        
        user.password = hash;
        next();
    });
    
});


// comparing the passwords
UserSchema.methods.comparePassword = function(password){
    
    var user = this;
    
    return bcrypt.compareSync(password,user.password);
    
};

// return the module
module.exports = mongoose.model('User',UserSchema);
