var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

// root

router.get("/", function(req, res){
  res.render("landing");
});

// ======== AUTH ROUTES ========

//show register form

router.get("/register", function(req, res){
  res.render("register");
});

//handle sign up logic

router.post("/register", function(req, res){
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(err, user){
    if (err) {
      req.flash("error", err.message);
      return res.redirect("register");
    }
    passport.authenticate("local")(req, res, function(){
      req.flash("success", "Welcome to Kelp, " + user.username + "!");
      res.redirect("/index");
    });
  });
});

// show login form

router.get("/login", function(req, res){
  res.render("login");
});

// login logic

router.post("/login", passport.authenticate("local", {
  successRedirect: "/index",
  failureRedirect: "/login"
  }), function(req, res) {
});

// LOG OUT

router.get("/logout", function(req, res){
  req.logout();
  req.flash("success", "Successfully logged out.");
  res.redirect("/index");
});

// show register form
router.get("/register", function(req, res){
  res.render("register", {page: 'register'}); 
});

//show login form
router.get("/login", function(req, res){
  res.render("login", {page: 'login'}); 
});

module.exports = router;