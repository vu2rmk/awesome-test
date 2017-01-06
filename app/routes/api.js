var User = require('../../models/user');
var jwt = require('jsonwebtoken');
var config  = require("../../config");

//super secret for creating tokens
var superSecret = config.secret;

module.exports = function(app,express){
    
    var apiRouter = express.Router();
    
    //route to authenticate user
    apiRouter.post('/authenticate',function(req,res){
        
        console.log(req.body.username);
        
        //find the user
        //select the password explicitly
        User.findOne({
            username: req.body.username
        }).select('password').exec(function(err,user){
            
            if(err) throw err;
            
            if(!user){
                
                res.json({
                    success: false,
                    message: 'Authentication Failed. User not found'
                });
                
            }else if(user){
                
                //check if the password matches
                var validPassword = user.comparePassword(req.body.password);
                
                if(!validPassword){
                    res.json({
                        success:false,
                        message:'Authentication failed. Wrong password.'
                    });
                }else {
                    
                    var token = jwt.sign(user, superSecret,{
                        expiresIn : '24h'
                    });
                    
                    
                    res.json({
                        success:true,
                        message:'Enter your token',
                        token: token
                    });
                }
            }
        });
    });
    
    apiRouter.use(function(req,res,next){
        
        console.log('Somebody just came to our app');
        
        var token = req.body.token || req.query.token || req.headers['x-access-token'];
        
        if(token){
            
            jwt.verify(token,superSecret,function(err,decoded){
                
                if(err){
                    return res.json({success:false,message:'Failed to authenticate token'})
                }else{
                    req.decoded  = decoded;
                    
                    next();
                }
            });
        }else {
            
            return res.status(403).send({
                success: false,
                message: 'No token provided'
            });
        }
    });
    
    apiRouter.get('/',function(req,res){
        res.json({message:'Horray! welcome to our api'});
    });
    
    //on the route that end in /users
    apiRouter.route('/users')
    
    .post(function(req,res){
        
        var user = new User();
        
        user.name = req.body.name;
        user.username = req.body.username;
        user.password = req.body.password;
        
        user.save(function(err){
            
            if(err) return res.send(err);
            
            res.json({message:'User created!'});
        });
    })
    
    //get all the users
    .get(function(req,res){
        
        User.find(function(err,users){
            
            if(err) return res.send(err);
            
            return res.json(users);
        })
    });
    
    // on the route that ends with /users/:user_id
    apiRouter.route('/users/:user_id')
    
    .get(function(req,res){
        
        User.finddById(req.params.user_id,function(err,user){
            
            if(err) return res.send(err);
            
            return res.json(user);
        });
    })
    
    .put(function(req,res){
        
        User.finddById(req.params.Id,function(err,user){
            
            if(err) return res.send(err);
            
            //set the new user information
            if(req.body.name) user.name =req.body.name;
            if(req.body.username) user.username =req.body.username;
            if(req.body.password) user.password =req.body.password;
            
            //save the user
            user.save(function(err){
               
               if(err) return res.send(err); 
                
            });
        })
    })
    
    .delete(function(req,res){
        
        User.remove({
            _id: req.params.user_id
            
        },function(err,user){
            
            if(err) return res.send(err);
            
            return res.json({message:'Successfully!! deleted'});
        });
        
        
    });
    
   return apiRouter;
    
};



