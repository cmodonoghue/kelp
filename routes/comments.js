var express = require("express");
var router = express.Router({mergeParams: true});
var Place = require("../models/place");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// COMMENTS NEW

router.get("/new", middleware.isLoggedIn, function(req, res){
  //find place by id
  Place.findById(req.params.id, function(err, place){
    if (err) {
      console.log(err);
    }
    else {
      res.render("comments/new", {place: place});
    }
  });
});

// COMMENTS CREATE

router.post("/", middleware.isLoggedIn, function(req, res){
  //look up place using id
  Place.findById(req.params.id, function(err, place){
    if (err ){
      console.log(err);
      res.redirect("/index");
    }
    else {
      Comment.create(req.body.comment, function(err, comment){
        if (err) {
          req.flash("error", "Something went wrong. Please try again.");
          console.log(err);
        }
        else {
          // add username and id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          // save comment
          comment.save();
          place.comments.push(comment);
          place.save();
          req.flash("success", "Successfully added comment.");
          res.redirect("/index/" + place._id);
        }
      });
    }
  });
  //create new comment
  //connect new comment to place
  //redirect to 'show' page
});

router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
  Comment.findById(req.params.comment_id, function(err, foundComment){
    if (err) {
      res.redirect("back");
    }
    else {
      res.render("comments/edit", {place_id: req.params.id, comment: foundComment});
    }
  });  
});

// COMMENTS UPDATE

router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
    if (err) {
      res.redirect("back");
    }
    else {
      res.redirect("/index/" + req.params.id);
    }
  });
});

// COMMENTS DESTROY ROUTE

router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
  Comment.findByIdAndRemove(req.params.comment_id, function(err){
    if (err) {
      res.redirect("back");
    }
    else {
      req.flash("success", "Comment deleted.");
      res.redirect("/index/" + req.params.id);
    }
  })
});

module.exports = router;