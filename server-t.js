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

//On the users that end with /users
apiRouter.route('/users')

    //adding user to the db
    .post(function(req,res){
        
        var user = new User();
        
        //Setting the users from the request
        user.name = req.body.name;
        user.username = req.body.username;
        user.passsword = req.body.passsword;
        
        //Saving the user in DB
        //accessed at POST http://localhost:8080/api/users
        user.save(function(err){
            
            if(err){
                
                if(err.code == 11000){
                    return res.json({message:'User already with that username exists'});
                }else{
                    
                    return res.send(err);
                }
            }
            
            return res.json({message:'User Created!'});
            
        });
        
    })
    
    //Getting the users from the DB
    //Accessed at GET http://localhost:8080/api/users
    .get(function(req,res){
       
        User.find(function(err,users){
            
            if(err) return res.send(err);
            
            return res.json(users);
        });
        
    });
    
    
//On routes that are ending with /users/:user_id
apiRouter.route('/users/:user_id')

    //getting the user with that user_id
    //accessed at GET http://localhost:8080/api/users/user_id
    .get(function(req,res){
        
        User.findById(req.params.user_id,function(err,user){
            
            if(err) return res.send(err);
            
            res.json(user);
        });
    })
    
    //updating the user details with id as user_id
    //accessed at PUT http://localhost:8080/api/users/user_id
    .put(function(req,res){
        
        User.findById(req.params.user_id,function(err,user){
           
           if(err) return res.send(err);
           
           //Getting the user updated info and setting it to user object
           if(req.body.name) user.name = req.body.name;
           if(req.body.username) user.username = req.body.username;
           if(req.body.passsword) user.passsword = req.body.passsword;
           
           
           user.save(function(err){
              
              if(err) return res.send(err);
              
              return res.json({message:'User updated!'});
               
           });
            
        });
    })
    
    //delete the user info
    //Accessed at DELETE http://locahost:8080/api/users/:user_id
    .delete(function(req,res){
        
        User.remove({
            
            _id : req.params.user_id
        },function(err,user){
            
            if(err) return res.send(err);
            
            res.json({message:'User deleted!'});
        });
        
    });
    
    
    
    
//REGISTERING THE ROUTES------------
//----------------------------------
app.use('/api',apiRouter);

//Starting the server...
app.listen(port);
console.log('Magic happens at Port ' + port);
    

    