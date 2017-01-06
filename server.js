//Pulling all the packages...
/// BASE SETUP
var express = require("express");
var app = express();
var morgan = require("morgan");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var jwt = require('jsonwebtoken');
var port = process.env.port || 8080;

var User = require('./models/user.js');

//Creating a secret string
var superSectret = 'thisissecret';



// APP CONFIGURATION
// use body parser to get the info from the post requests
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


//configure the app to set the CORS request
app.use(function(req,res,next){
    
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','GET, POST');
    res.setHeader('Access-Control-Allow-Headers','X-Requested-With, content-type, \Authorization');
    next();
});

// log all requests to console..
app.use(morgan('dev'));

// connect to our database
mongoose.connect('mongodb://localhost:27017/my_db');

// Routes for our API
var apiRouter = express.Router();

//Route for authenticating users
apiRouter.post('/authenticate',function(req,res){
    
    //find the user
    //select the name username and password explicitly
    User.findOne({
        username:req.body.username
    }).select('name username password').exec(function(err,user){
        
        if(err) throw err;
        
        // no user with that username was found
        if(!user){
            res.json({
                success:false,
                message: 'Authentication failed. User not found.'
            });
        } else if(user){
            
            // check if password mathces
            var validPassword = user.comparePassword(req.body.password);
            if(!validPassword){
                
                res.json({
                    
                    success:false,
                    message:'Authentication failed. Wrong password'
                });
            } else {
                
                // if the user is found and the password is right
                // create a token
                var token = jwt.sign({
                    name:user.name,
                    username:user.username
                },superSectret,{
                    expiresInMinutes:1440 //expires in 24 hours
                });
                
                res.json({
                    success:true,
                    message:'Enjoy your token!',
                    token: token
                });
            }
        }
    });
});

// middleware to use all the requests
apiRouter.use(function(req,res,next){
    
    // do the logging
    console.log('Somebody just came to to our app!');
    
    next();
});

// test route to make sure everything is working
apiRouter.get('/',function(req,res){
    
    res.json({message:'horray! welcome to our api!'});
    
});

// on route that ends in /users
//..........................................................
apiRouter.route('/users')

    // create a user... at POST http://localhost:8080/api/users
    .post(function(req,res){
        
        // create a new instance of the user model...
        var user = new User();
        
        // set the users information (comes from the request)
        user.name = req.body.name;
        user.username = req.body.username;
        user.password = req.body.password;
        
        // save the user and check for errors...
        user.save(function(err){
            
            if(err){
                
                if(err.code == 11000)
                return res.json({success:false,message:'A user with that /username already exists'});
                else
                return res.send(err);
            }
            
            res.json({message:'User created!'});
        })
        
        
        
    })
    
    // get all the users... (accessed at GET http://localhost:8080/api/users)
    .get(function(req,res){
        
        User.find(function(err,users) {
            // body...
            if(err) return res.send(err);
            
            
           return res.json(users);
        });
    });
    
  
//on the routes that ends with /users/:user_id
//..................................................................
apiRouter.route('/users/:user_id')
    
    // get the user with that id
    // accessed at GET https://localhost:8080/api/users/user_id
    .get(function(req,res){
        
        User.findById(req.params.user_id,function(err,user){
            
            
            if (err) return res.send(err);
            
            // return the user
            res.json(user);
        });
    })
    
    //update the user with the user_id
    // accessed at PUT https:localhost:8080/api/users/:user_id
    .put(function(req,res){
        
        User.findById(req.params.user_id,function(err,user){
            
            if(err) return res.send(err);
            
            // update the user only if its new
            if(req.body.name) user.name = req.body.name;
            if(req.body.username) user.username = req.body.username;
            if(req.body.password) user.password = req.body.password;
            
            // save the user
            user.save(function(err) {
                
                if(err) return res.send(err);
                
                // return a message
                return res.json({message:'User updated!'});
            });
            
            
        });
        
        
    })
    
    //delete the user with this id
    //accessed from DELETE http://localhost:8080/api/user/:user_id
    .delete(function(req,res){
        
        User.remove({
            
            _id: req.params.user_id
        },
        function(err,user){
            
            if(err) return res.send(err);
            
            res.json({message:'Successfully deleted!!'});
            
        });
        
    });
    
    
// REGISTER OUR ROUTES.............................
/// All of our routes will be prefixed with /api
app.use('/api',apiRouter);

// START THE SERVER
app.listen(port);
console.log('Magic happens at port '+port);
