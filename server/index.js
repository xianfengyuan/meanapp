var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var _ = require('lodash');
var Datastore = require('nedb')
var github = require('octonode');
var dotenv = require('dotenv').config();
var request = require('request');
var qs = require('querystring');

// Create the application.
var app = express();

// Add Middleware necessary for REST API's
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(methodOverride('X-HTTP-Method-Override'));

// CORS Support
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

db = {};
db.users = new Datastore({ filename: 'db/users.db', autoload: true });

function ensureAuthenticated(req, res, next) {
  if (!req.header('Authorization')) {
    return res.status(401).send({ message: 'Please make sure your request has an Authorization header' });
  }
  var token = req.header('Authorization').split(' ')[1];

  // Check if the OAUTH2 token has been previously authorized

  db.users.find({ oauth_token: token  }, function (err, users) {

    // Unauthorized
    if(_.isEmpty(users)){
      return res.status(401).send({ message: 'Unauthorized' });
    }
    // Authorized
    else{

       // Adding user information to the request
       req.user = users[0]
       next();
    }
  });
}

// next(err, res, body)
function revokeToken(token, next) {
  // Revoke access to the Access token
  // https://developer.github.com/v3/oauth_authorizations/#reset-an-authorization
  // POST /applications/:client_id/tokens/:access_token
  var resetTokenUrl = "https://api.github.com/applications/"+process.env.GITHUB_CLIENT_ID+'/tokens/'+ token;
  var authorization = new Buffer(process.env.GITHUB_CLIENT_ID + ":" + process.env.GITHUB_CLIENT_SECRET).toString("base64");

  var headers = {
    "Authorization": "Basic "+authorization,
    'User-Agent': 'NodeJS'
  }

  // Revoke access to the token
  request.delete({ url: resetTokenUrl, headers: headers }, function(err, res, body) {
    if (err) {
      return next(err);
    }
    next(null, res, body);
  });
}

/*
 |--------------------------------------------------------------------------
 | Login with GitHub
 |--------------------------------------------------------------------------
*/

app.post('/auth/github', function(req, res) {

  var accessTokenUrl = 'https://github.com/login/oauth/access_token';

  var params = {
    code: req.body.code,
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_CLIENT_SECRET,
    redirect_uri: req.body.redirectUri
  };

    // Exchange authorization code for access token.
  request.post({ url: accessTokenUrl, headers: {'Content-Type': 'application/json'}, qs: params }, function(err, response, token) {
    // console.log('====================');
    // console.log(JSON.stringify(params));
    if(err){
      return res.status(400).send({ message: 'post error, User not found in github: ' + JSON.stringify(err) + accessTokenUrl + JSON.stringify(params) });
    }

     var access_token = qs.parse(token).access_token;
     var github_client = github.client(access_token);

         // Retrieve profile information about the current user.
     github_client.me().info(function(err, profile){

       if(err){
         return res.status(400).send(token);
       }

       var github_id = profile['id'];
       var github_login = profile['login'];
       var userUrl = 'http://localhost:' + process.env.LISTEN_PORT + '/user?id__regex=/^' + github_login + '/i';
       request(userUrl, { json: true }, function(err, response, body) {
         console.log('check local DB: ' + JSON.stringify(body));
         if (err || !err && response.statusCode > 200 && response.statusCode < 300) {
           return revokeToken(access_token, function(err, response, body) {
             if (err) {
               return res.status(400).send({ message: 'check user: revoke user failed: ' + JSON.stringify(access_token) });
             }
             return res.status(400).send({ message: 'check user: user not found in local DB: ' + JSON.stringify(access_token) });
           });
         }

         // found user in local DB
         var user = { _id: github_id, oauth_token: access_token }
         db.users.find({ _id: github_id  }, function (err, docs) {
           // The user doesn't have an account already
           if(_.isEmpty(docs)){
             // Create the user
             db.users.insert(user);
           }
           // Update the oauth2 token
           else{
             db.users.update({ _id: github_id }, { $set: { oauth_token: access_token } } )
           }
         });
         res.send({token: access_token});
      }); //request check if user is legit
    }); //github auth
  }); // get auth token
});

/*
|--------------------------------------------------------------------------
| Logout
|--------------------------------------------------------------------------
*/

app.post('/logout', ensureAuthenticated, function(req, res) {

  revokeToken(req.user.oauth_token, function(err, response, payload) {
    if (!err && response.statusCode >= 200 && response.statusCode < 300){
      db.users.remove({ oauth_token: req.user.oauth_token  }, function (err, numDeleted) {
        if(err){
          return res.status(400).send({ message: 'Deletion failed' });
        }
        res.status(200).send({ message: 'Deleted' + numDeleted + 'user(s)' });
      });
    }
    else{
      res.status(500).send();
    }
  });
});

// Connect to MongoDB
mongoose.connect('mongodb://localhost/meanapp');
mongoose.connection.once('open', function() {

  // Load the models.
  app.models = require('./models/index');

  // Load the routes.
  var routes = require('./routes');
  _.each(routes, function(controller, route) {
    app.use(route, controller(app, route));
  });

  console.log('Listening on port ' + process.env.LISTEN_PORT + '...');
  app.listen(process.env.LISTEN_PORT);
});
