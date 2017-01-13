var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");
require("../models/articles");
var article = mongoose.model("Article");
var passport = require('passport');
require("../models/user");
var User = mongoose.model('User');
var jwt = require('express-jwt');

var auth = jwt({secret: 'A_Filthy_Dark_secret', userProperty: 'payload'});

router.post('/register',function(req,res){
  var user = new User();
  user.name = req.body.name;
  user.username = req.body.username;
  user.email = req.body.email;
  user.setPassword(req.body.password);

  user.save(function(err){
    if(err){
      res.send(err);
    }else {
      var token;
      token = user.generateJwt();
      res.status(200);
      res.json({
        "token" : token
      });
    }
  });
});

router.post('/login',function(req, res){
  
  passport.authenticate('local', function(err,user,info){

    var token;

    if (err){
      return;
    }

     if(user){
        token = user.generateJwt();
        res.status(200);
        res.json({
          "token" : token
        });
      } else {
        // If user is not found
        res.status(401).json(info);
      }
    })(req, res);

});

router.get('/articles', auth ,function(req,res){

  if(!req.payload._id){
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {
    // Otherwise continue
    User
      .findById(req.payload._id)
      .populate('article')
      .exec(function(err, User) {
          if (err){ throw err };
          
          res.json(User.article);
      });

  }

 

});

router.post('/articles', auth, function(req,res){

  if(!req.payload._id){
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {
    // Otherwise continue
    User
      .findById(req.payload._id)
      .exec(function(err, User) {
        var Article = new article(req.body);
        // User.article = Article.user;

        Article.save(function(err){
          if (err){ throw err };  
          User.article.unshift(Article);                          
          User.save(function(err,User){
          if (err){ throw err };
            User.populate('article',function(err,User){
              res.json(User.article)
            })
          })
        })
      });
  }

});

router.delete('/articles/:id', auth, function(req,res){

  if(!req.payload._id){
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {
    // Otherwise continue
    User
      .findById(req.payload._id)
      .exec(function(err, User) {
        article.remove({ _id : req.params.id},function(err){
          if (err){ throw err };
        })
        User.populate('article',function(err,User){
          res.json(User.article)
        });
      });
  }
});

router.put('/articles/:id', auth, function(req,res){

  if(!req.payload._id){
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {
    // Otherwise continue
    User
      .findById(req.payload._id)
      .exec(function(err, User) {
        article.findById(req.params.id,function(err,Article){
          if(err){ throw err }
          Article.update({
            title : req.body.title,
            note : req.body.note
          },function(err,Article){
            if (err){ throw err };
            res.json(Article);
          })
        })
        // User.populate('article',function(err,User){
        //   res.json(User.article)
        // });
      });
  }
});

// router.get('/articles/article/:article', auth, function(req,res){

//   if(!req.payload._id){
//     res.status(401).json({
//       "message" : "UnauthorizedError: private profile"
//     });
//   } else {
//     // Otherwise continue
//     User
//       .findById(req.payload._id)
//       .exec(function(err, User) {
//         article.findById(req.params.article,function(err,article){
//           if(err){ throw err }
//           res.json(article);
//         })
//       });
//   }
// });

// router.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

// router.get('/auth/facebook/callback',
//         passport.authenticate('facebook', {
//             successRedirect : '/profile',
//             failureRedirect : '/'
//         }));

// // route for logging out
// router.get('/logout', function(req, res) {
//     req.logout();
//     res.redirect('/');
// });

module.exports = router;
