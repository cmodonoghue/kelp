var express = require("express");
var router = express.Router();
var Place = require("../models/place");
var middleware = require("../middleware");

//INDEX - show all campgrounds
router.get("/", function(req, res){
  // Get all locations from DB
  Place.find({}, function(err, allPlaces){
     if(err){
         console.log(err);
     } else {
        res.render("places/index",{places: allPlaces, page: 'index'});
     }
  });
});

// CREATE PLACE

router.post("/", middleware.isLoggedIn, function(req, res){
  //get data from form and save to variables
  var name = req.body.name;
  var image = req.body.image;
  var description = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  }
  //create object to make next part simpler
  var newPlace = {name: name, image: image, description: description, author: author}
  //create new campground and save to database
  Place.create(newPlace, function(err, newlyCreated){
      if (err) {
        console.log(err);
      }
      else {
          //redirect back to locations page
          res.redirect("/index");
      }
  });
});

// NEW

router.get("/new", middleware.isLoggedIn, function(req, res){
  res.render("places/new");
});

//SHOW

router.get("/:id", function(req, res){
  //find campground with provided id
  Place.findById(req.params.id).populate("comments").exec(function(err, foundPlace){
    if (err) {
      console.log(err);
    }
    else {
      console.log(foundPlace);
      res.render("places/show", {place:foundPlace});
      //sends foundPlace into show template as "place" so it can be used
    }
  });
});

// EDIT place route

router.get("/:id/edit", middleware.checkPlaceOwnership, function(req, res){
  Place.findById(req.params.id, function(err, foundPlace){
    res.render("places/edit", {place: foundPlace});
  }); 
});

// update place route

router.put("/:id", middleware.checkPlaceOwnership, function(req, res){
  //find and update correct location
  Place.findByIdAndUpdate(req.params.id, req.body.place, function(err, updatedPlace){
    if (err) {
      res.redirect("/index");
    }
    else {
      res.redirect("/index/" + req.params.id)
    }
  });
  //redirect
});

// destroy route

router.delete("/:id", middleware.checkPlaceOwnership, function(req, res){
  Place.findByIdAndRemove(req.params.id, function(err){
    if (err){
      res.redirect("/index");
    }
    else {
      res.redirect("/index");
    }
  });
});

module.exports = router;