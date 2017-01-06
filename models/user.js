//Grab the required packages
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bcrypt = require("bcrypt-nodejs");

// Ddefining the schema
var UserSchema = new Schema({
    
    name:String,
    username: {type:String,required:true,index:{unique:true}},
    password: {type:String,required:true,select:false}
});

//Hashing the password before saving
UserSchema.pre('save',function(next){
    
    var user = this;
    
    // checking if the user is modified
    if(!user.isModified) return next();
    
    bcrypt.hash(user.password,null,null,function(err,hash){
        
        if(err) return next(err);
        
        //hash the password
        user.password = hash;
        
        next();
        
    });
});


// Adding a method to compare passsword
UserSchema.methods.comparePassword = function(passsword){
    
    var user =this;
    
    return bcrypt.compareSync(passsword,user.password);
};

//Return the model
module.exports =  mongoose.model('User',UserSchema);
