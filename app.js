var express        =  require("express"),
    app            =  express(),
    bodyParser     =  require("body-parser"),
    mongoose       =  require("mongoose"),
    flash          =  require("connect-flash"),
    passport       =  require("passport"),
    LocalStrategy  =  require("passport-local"),
    Place          =  require("./models/place"),
    User           =  require("./models/user"),
    seedDB         =  require("./seeds"),
    Comment        =  require("./models/comment"),
    methodOverride =  require("method-override")


    // requiring routes

var commentRoutes    = require("./routes/comments"),
    placeRoutes = require("./routes/places"),
    authRoutes       = require("./routes/auth")

// mongoose.connect("mongodb://localhost:27017/kelp", { useNewUrlParser: true });
mongoose.connect("mongodb://cmod:password1@ds145871.mlab.com:45871/kelp", { useNewUrlParser: true });
// mongodb://cmod:password1@ds145871.mlab.com:45871/kelp
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}))
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash());
// seed the database
// seedDB();

// PASSPORT CONFIG
app.use(require("express-session")({
  secret: "hello there",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use(authRoutes);
app.use("/index/:id/comments", commentRoutes);
app.use("/index", placeRoutes);

app.listen(process.env.PORT || 3000, function(){
  console.log("Kelp has started.");
});