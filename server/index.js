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
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
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
  request.post({ url: accessTokenUrl, qs: params }, function(err, response, token) {

     var access_token = qs.parse(token).access_token;
     var github_client = github.client(access_token);

         // Retrieve profile information about the current user.
     github_client.me().info(function(err, profile){

       if(err){
         return res.status(400).send({ message: 'User not found' });
       }

       var github_id = profile['id'];
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
    });
  });
});

/*
|--------------------------------------------------------------------------
| Logout
|--------------------------------------------------------------------------
*/

app.post('/logout', ensureAuthenticated, function(req, res) {

  // Revoke access to the Access token
  // https://developer.github.com/v3/oauth_authorizations/#reset-an-authorization
  // POST /applications/:client_id/tokens/:access_token
  var resetTokenUrl = "https://api.github.com/applications/"+process.env.GITHUB_CLIENT_ID+'/tokens/'+ req.user.oauth_token;
  var authorization = new Buffer(process.env.GITHUB_CLIENT_ID + ":" + process.env.GITHUB_CLIENT_SECRET).toString("base64");

  var headers = {
    "Authorization": "Basic "+authorization,
    'User-Agent': 'NodeJS'
  }

  // Revoke access to the token
  request.post({ url: resetTokenUrl, headers: headers }, function(err, response, payload) {
    if (!err && response.statusCode == 200){
      db.users.update({ oauth_token: req.user.oauth_token }, { $set: { oauth_token: null } });
      res.status(200).send();
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

  console.log('Listening on port 3000...');
  app.listen(3000);
});
