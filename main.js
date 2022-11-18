var express = require('express');
var app = express();
const cookieParser = require("cookie-parser");
const sessions = require('express-session');

const mongoose = require("mongoose");

const mongoDB = "mongodb+srv://deneme:deneme@cluster0.b2biihn.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const Schema = mongoose.Schema;

// USER SCHEMA MODEL FOR MONGODB //

const userSchema = new Schema({
  username: String,
  password: String,
  password2: String,
  email: String,
  comments : { type : Array , "default" : [] }
});

const userModel = mongoose.model("userModel", userSchema);


// PLAYER SCHEMA MODEL FOR MONGODB//
const playerSchema = new Schema({
  fullname: String,
  age: Number,
  comments : { type : Array , "default" : [] },
  pid: Number
});

const playerModel = mongoose.model("player", playerSchema);



app.set('view engine', 'ejs');
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded( {extended: true} ));

app.use(express.static(__dirname));

app.use(cookieParser());
const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false
}));
// use res.render to load up an ejs view file

//GET REQUESTS
app.get('/', function(req, res){
  res.redirect('/login')
})

app.get('/login', function(req, res) {
  if(req.session.username && req.session.password){
    res.render('userprofile',{ username: req.session.username, email: req.session.email, password: req.session.password })
  }else{
    res.render('login');
  }

});
app.get('/register', function(req, res) {
  if(req.session){
    console.log(req.session);
  }
  res.render('register');
});
app.get('/playerprofile', function(req, res){
    res.render('playerprofile')
})
app.get('/playerprofile/:playername', function(req, res) {
  //find the player by player name from the database
  console.log(req.params['playername'])
  var name = req.params['playername'].substring(1)

  var query = {fullname: name}

  playerModel.find(query, function (err, playerinfo) {
    res.render('playerprofile',{
      pName: playerinfo[0].fullname,
      pAge: playerinfo[0].age,
      standardcomments : playerinfo[0].comments
    })
  });
});

app.get('/mainpage', function(req, res) {
  
  playerModel.find({}, function (err, playerlist) { // tüm oyuncuları bulup listeyi aktarır

      res.render('mainpage',{
        arr:playerlist
      })
  });
});

app.get('/addcomment', function(req, res) {
  if(req.session){
    console.log(req.session);
  }
  res.render('addcomment');
});

app.get('/addcomment/:playername', function(req, res) {
  var name = req.params['playername'].substring(1)

  if(req.session){
    console.log(req.session);
  }
  res.render('addcomment',{
    pName: name
  });
});


app.get('/userprofile', function(req, res){
  console.log("req session userprofile" + req.session);
  if(req.session.username){
    console.log("session exists");
    res.render('userprofile',{ username: req.session.username, email: req.session.email, password: req.session.password })
  }else{
    res.redirect('/login')
  }
})


//POST REQUESTS
app.post('/login', function(req, res) {
  console.log("req session login" + req.session);

  userModel.findOne({
    email: req.body.email
  }).then(
    (user) => {
      console.log(user);

      if(user.password == req.body.password){
        req.session.email = req.body.email
        req.session.password = req.body.password
        req.session.username = user.username
        res.redirect("/mainpage")

      }else{
        res.send("Wrong Password");
      }
    }
  ).catch(
    (error) => {
      res.send("email is wrong!")
    }
  );


});


app.post('/register', function(req, res) {
  console.log(req.body);

  const userInstance = new userModel(
  {
    username: req.body.username,
    password : req.body.password,
    password2 : req.body.password2,
    email: req.body.email
  });
  if (req.body.password!=req.body.password2) // bakılacak
  {
    res.render("register", {errorMsg: "Password's do not match"})
  }
  else{
    userInstance.save((err) => {
      if (err) {
        console.log(err);
        res.send("error")
      }else{
        res.redirect('/login')

      }
    });
  }

});

app.post('/updateuser', function(req, res){
  if(req.session.username){
    console.log(req.session.username);
    var userObj = {}
    if(req.body.username != "" ){
      userObj['username'] = req.body.username
    }
    if(req.body.password != "" ){
      userObj['password'] = req.body.password
    }
    if(req.body.email != "" ){
      userObj['email'] = req.body.email
    }


    userModel.findOneAndUpdate({email: req.session.email}, userObj, (err, userSample) => {
      if(!err){
        if(req.body.username != "" ){ req.session.username = req.body.username}
        if(req.body.password != "" ){ req.session.password = req.body.password}
        if(req.body.email != "" ){ req.session.email = req.body.email}
        console.log("Updated! " + JSON.stringify(userSample));
        res.redirect('/userprofile')
      }else{
        console.log(err);
      }
    })

  }
})

app.post('/deleteuser',function(req,res){
  if(req.session.username){
    userModel.findOneAndRemove({email: req.session.email}, (err) => {
      if (err) {
        res.send("Error Deleting.");
      }else{
        req.session.destroy();
        res.redirect('/login')
      }
    });
  }else{
    res.redirect('/login')
  }
})


app.post('/addcomment',async function(req,res){
  var name = req.body.pName
  await playerModel.findOneAndUpdate({
    fullname: name
  },
  {
    $addToSet:{
      comments: req.body.comment
    }

  }
  );
  res.redirect('playerprofile/:'+name)
})


app.listen(process.env.PORT || 3001);
