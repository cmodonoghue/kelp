var Place = require("../models/place");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkPlaceOwnership = function(req, res, next) {
  if(req.isAuthenticated()) {
      Place.findById(req.params.id, function(err, foundPlace){
        if (err){
          req.flash("error", "Location not found.");
          res.redirect("/index");
        }
        else {
          //does user own campground?
          if (foundPlace.author.id.equals(req.user._id)) {
            next();
          }
          else {
            req.flash("error", "You don't have permission to do that.");
            res.redirect("back");
          }        
        }
      });
    } else {
      req.flash("error", "You must be logged in to do that.");
      res.redirect("back");
  }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if(req.isAuthenticated()) {
      Comment.findById(req.params.comment_id, function(err, foundComment){
        if (err){
          res.redirect("/index");
        }
        else {
          //does user own comment?
          if (foundComment.author.id.equals(req.user._id)) {
            next();
          }
          else {
            req.flash("error", "You don't have permission to do that.");
            res.redirect("back");
          }        
        }
      });
    } else {
      req.flash("error", "You must be logged in to do that.");
      res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next) {
  if(req.isAuthenticated()){
    return next();
  }
  req.flash("error", "You must be logged in to do that.");
  res.redirect("/login");
}

module.exports = middlewareObj;