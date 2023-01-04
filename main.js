var express = require('express');
var app = express();
const cookieParser = require("cookie-parser");
const sessions = require('express-session');

const mongoose = require("mongoose");
const { query } = require('express');

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
  isVerified: String,
  comments : { type : Array , "default" : [] },
  followings : { type : Array , "default" : [] },
  imagelink: String,
  favorites : { type : Array , "default" : [] },
});

const userModel = mongoose.model("userModel", userSchema);


// PLAYER SCHEMA MODEL FOR MONGODB//
const playerSchema = new Schema({
  fullname: String,
  age: Number,
  comments : { type : Array , "default" : [] },
  verifiedcomments : { type : Array , "default" : [] },
  pid: Number,
  position:String,
  team:String
});

const playerModel = mongoose.model("player", playerSchema);

const requestSchema = new Schema({
  username: String,
  email: String,
})

const requestModel = mongoose.model("verifiedrequests", requestSchema);

const reportSchema = new Schema({
  username: String,
  reportmessage: String,
})

const reportModel = mongoose.model("bugreports", reportSchema);

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
    resave: true
}));
// use res.render to load up an ejs view file

//GET REQUESTS
app.get('/', function(req, res){
  res.redirect('/login')
})

app.get('/login', function(req, res) {
  if(req.session) console.log(req.session);
  if(req.session.username && req.session.password){
    res.render('userprofile',{ username: req.session.username, email: req.session.email, password: req.session.password, favoritesArray: userinfo[0].favorites })
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
app.get('/playerprofile/:playername', async function(req, res) {
  var faved = false;
  if(req.session.username){
    var theFavorites = []

     await userModel.findOne({
       username: req.session.username
     }).then(
       (user)=>{
       theFavorites = user.favorites
     });

     for(let z=0;z<theFavorites.length;z++){
       theFavorites.forEach((item, index, object) => {
         if(theFavorites[z]['name'] == decodeURI(req.url.split("/").pop().slice(1))){
           faved = true
         }
       });
     }
   }
  //find the player by player name from the database
  var name = req.params['playername'].substring(1)

  var query = {fullname: name}

  playerModel.find(query, function (err, playerinfo) {
    var result = playerinfo[0].comments.findIndex(({ commenter }) => commenter === req.session.username)
    var result2 = playerinfo[0].verifiedcomments.findIndex(({ commenter }) => commenter === req.session.username)


    var size = playerinfo[0].verifiedcomments.length
    var sum =0;
    var avg;

    for(let i=0;i<size;i++){
      sum+= Number(playerinfo[0].verifiedcomments[i]['rating'])
    }

    if(size!=0){
      avg = (sum/size).toFixed(1)
    }
    else{
      avg = -1
    }


    if(result==-1 && result2==-1){                 // daha önce yorumu yoksa
      res.render('playerprofile',{
        pName: playerinfo[0].fullname,
        pAge: playerinfo[0].age,
        standardcomments : playerinfo[0].comments,
        verifiedcomments : playerinfo[0].verifiedcomments,

        commenttype: "add",
        average: avg,
        favored: faved
      })
    }
    else{                           // daha önce yorumu varsa
      res.render('playerprofile',{
        pName: playerinfo[0].fullname,
        pAge: playerinfo[0].age,
        standardcomments : playerinfo[0].comments,
        verifiedcomments : playerinfo[0].verifiedcomments,

        commenttype: "edit",
        average: avg,
        favored: faved
      })
    }
  });
});

app.get('/mainpage', function(req, res) {

  var imageurl;
  userModel.find({
    username:req.session.username
  },
  function(err,user){
    imageurl = user[0].imagelink
    console.log(imageurl)
    playerModel.find({}, function (err, playerlist) { // tüm oyuncuları bulup listeyi aktarır

        res.render('mainpage',{
          arr:playerlist,
          searchtext: "",
          position:"",
          link: imageurl
        })
    });
  }
  )


});
app.post('/report', async function(req,res){

  //var filterstring = req.body.playerpos
  //var query = {position: filterstring}

  var myobj = { username: req.session.username, reportmessage:req.body.reportmsg};
  await reportModel.insertMany(myobj, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
  });

  userModel.find({username: req.session.username}, function (err, userinfo) {
    res.render('userprofile',{
      username: req.session.username,
      email: req.session.email,
      password: req.session.password,
      commentarray: userinfo[0].comments,
      userimage: userinfo[0].imagelink
    })
  });

})

// ADD COMMENT PAGE
app.get('/addcomment', function(req, res) {
  if(req.session){
    console.log(req.session);
  }
  res.render('addcomment');
});

app.get('/addcomment/:playername', async function(req, res) {
  if(!req.session.username){
    res.redirect('/login')
  }else{
    var name = req.params['playername'].substring(1)

    await userModel.findOne({
      username: req.session.username
    }).then(
      (user)=>{
        if(user.isVerified=="yes"){
          res.render('addcomment',{pName: name,showrating:"yes"});

        }
        else{
          res.render('addcomment',{pName: name,showrating:"no"});

        }
      }
    )
  }

});



// EDIT COMMENT PAGE
app.get('/editcomment', function(req, res) {
  if(req.session){
    console.log(req.session);
  }
  res.render('editcomment');
});
app.get('/editcomment/:playername',async function(req, res) {
  if(!req.session.username){
    res.redirect('/login')
  }else{
    var name = req.params['playername'].substring(1)

    await userModel.findOne({
      username: req.session.username
    }).then(
      (user)=>{
        var index = user.comments.findIndex(({ playername }) => playername === name)
        var usercomment = user.comments[index]['comment']
        var userrating = user.comments[index]['rating']

        if(user.isVerified=="yes"){
          res.render('editcomment',{pName: name,showrating:"yes",currentcomment:usercomment,currentrating:userrating});

        }
        else{
          res.render('editcomment',{pName: name,showrating:"no",currentcomment:usercomment});

        }
      }
    )
  }
});

app.get('/userprofile', function(req, res){
  console.log("req session userprofile" + req.session);
  if(req.session.username){
    console.log("session exists");

    userModel.find({username: req.session.username}, function (err, userinfo) {
      res.render('userprofile',{
        username: req.session.username,
        email: req.session.email,
        password: req.session.password,
        commentarray: userinfo[0].comments,
        userimage: userinfo[0].imagelink,
        favoritesArray: userinfo[0].favorites
      })
    });
  }else{
    res.redirect('/login')
  }
})

app.get('/verifieduserprofile/:username', function(req, res){

  var verifiedusername = req.params['username'].substring(1)
  var followed=-1
  userModel.find({username:req.session.username},function (err, user){
    followed= user[0].followings.findIndex(({ name }) => name === verifiedusername)
    console.log(followed)
    userModel.find({username: verifiedusername}, function (err, userinfo) {
      res.render('verifieduserprofile',{
        username: userinfo[0].username,
        commentarray: userinfo[0].comments,
        isfollowed: followed,
        link:userinfo[0].imagelink
      })
    });
  })


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
    email: req.body.email,
    imagelink: "/images/userimage.jpg"
  });
  if (req.body.password!=req.body.password2) // bakılacak
  {
    res.render("register", {errorMsg: "Password's do not match"})
  }
  else{
    if(req.body.verified=="yes"){
      const requestInstance = new requestModel(
        {
          username: req.body.username,
          email: req.body.email,
        });

        requestInstance.save((err) => {
        if (err) {
          console.log(err);
          res.send("error")
        }
      });
      const userInstanceNew = new userModel(
      {
        username: req.body.username,
        password : req.body.password,
        password2 : req.body.password2,
        email: req.body.email,
        isVerified: "no",
        imagelink: "/images/userimage.jpg"
      });
      userInstanceNew.save((err) => {
        if (err) {
          console.log(err);
          res.send("error")
        }else{
          res.redirect('/login')

        }
      });
    }else{
      userInstance.save((err) => {
        if (err) {
          console.log(err);
          res.send("error")
        }else{
          res.redirect('/login')

        }
      });
    }


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

app.post('/logout',function(req,res){
  if(req.session.username){
    req.session.destroy();
  }else{
    res.redirect('/login')
  }
})



app.post('/addcomment',async function(req,res){
  var name = req.body.pName
  if(req.body.comment.length<20)
  {
    res.send('comment is too short')
  }
  else if(req.body.comment.length>200){
    res.send('comment is too long')
  }
  else{

    await userModel.findOne({
      username: req.session.username
    }).then(
      async (user)=>{
        if(user.isVerified=="yes"){
          await playerModel.findOneAndUpdate({
            fullname: name
          },
          {
              $addToSet:{
                verifiedcomments: {
                  comment: req.body.comment,
                  commenter: req.session.username,
                  rating: req.body.rating
                }
              },
          }
          );
        }else if(!user.isVerified){
            await playerModel.findOneAndUpdate({
              fullname: name
            },
            {
                $addToSet:{
                  comments: {
                    comment: req.body.comment,
                    commenter: req.session.username,
                    rating: req.body.rating
                  }
                },
            }
            );
        }else{
          res.send("wait to be verified")
          return 0
        }
      }

    )

    if(req.body.rating!=null){
      await userModel.findOneAndUpdate({
        username: req.session.username
      },
      {
        $addToSet:{
          comments: {
            comment: req.body.comment,
            playername: name,
            rating: req.body.rating
          }
        }

      }
      );
    }
    else{
      await userModel.findOneAndUpdate({
        username: req.session.username
      },
      {
        $addToSet:{
          comments: {
            comment: req.body.comment,
            playername: name,
          }
        }

      }
      );
    }



    res.redirect('playerprofile/:'+name)
  }


})

app.post('/edit',async function(req,res){ //
  var name = req.body.pName
  var userName = req.session.username
  if(req.body.comment.length<20)
  {
    res.send('comment is too short')
  }
  else if(req.body.comment.length>200){
    res.send('comment is too long')
  }
  else{

    await userModel.findOne({
      username: req.session.username
    }).then(
      async (user)=>{
        if(user.isVerified=="yes"){
          await playerModel.updateOne({
            fullname: name,
            "verifiedcomments.commenter":userName
          },
          {
            $set:{
              "verifiedcomments.$.comment": req.body.comment,
              "verifiedcomments.$.rating": req.body.rating
            }
          },
          );
        }
        else{
          await playerModel.updateOne({
            fullname: name,
            "comments.commenter":userName
          },
          {
            $set:{
              "comments.$.comment": req.body.comment
            }
          },
          );
        }
      }

    )


    await userModel.updateOne({
      username: req.session.username,
      "comments.playername": name
    },
    {
      $set:{
        "comments.$.comment": req.body.comment,
        "comments.$.rating": req.body.rating,

      }

    },

    );

    res.redirect('playerprofile/:'+name)
  }

})

app.post('/deletecomment', async function(req,res){
  var name = req.body.pName

  await userModel.findOne({
    username: req.session.username
  }).then(
    async (user)=>{
      if(user.isVerified=="yes"){
        await playerModel.updateOne({
          fullname: name
        },
        {
          $pull:{
            verifiedcomments: {
              commenter: req.session.username
            }
          }

        }
        );
      }
      else{
        await playerModel.updateOne({
          fullname: name
        },
        {
          $pull:{
            comments: {
              commenter: req.session.username
            }
          }

        }
        );
      }
    }

  )
  await userModel.updateOne({
    username: req.session.username
  },
  {
    $pull:{
      comments: {
        playername: name
      }
    }

  }
  );

  res.redirect('playerprofile/:'+name)


})

app.post('/mainpage', async function(req,res){

  var imageurl;
  userModel.find({
    username:req.session.username
  },
  function(err,user){
    imageurl = user[0].imagelink
    console.log(req.body.name)
    playerModel.find({}, function (err,playerlist) { // tüm oyuncuları bulup listeyi aktarır
      res.render('mainpage',{
        arr: playerlist,
        searchtext: req.body.name,
        position:"",
        link: imageurl
      })
    });
  }
  )



})


//////////////////////////////////////////////////


app.post('/filterTeamPlayers', function(req,res){

  //var filterstring = req.body.playerpos
  //var query = {position: filterstring}
  console.log(req.body.team)
  var imageurl;
  userModel.find({
    username:req.session.username
  },
  function(err,user){
    imageurl = user[0].imagelink
    playerModel.find({}, function (err, playerlist) { // tüm oyuncuları bulup listeyi aktarır
      res.render('mainpage',{
        arr:playerlist,
        team:req.body.team,
        link:imageurl
      })
  });
  }
  )
})

///////////////////////////////////////////////////

app.post('/filterplayers', function(req,res){

  //var filterstring = req.body.playerpos
  //var query = {position: filterstring}
  console.log(req.body.position)
  var imageurl;
  userModel.find({
    username:req.session.username
  },
  function(err,user){
    imageurl = user[0].imagelink
    playerModel.find({}, function (err, playerlist) { // tüm oyuncuları bulup listeyi aktarır
      res.render('mainpage',{
        arr:playerlist,
        searchtext: "",
        position: req.body.position,
        link:imageurl
      })
  });
  }
  )
})

app.get('/rankings', function(req, res){
  playerModel.find({}, function (err, playerinfo) {
        emptyArr = []

        console.log(req.body.position)


        for (player in playerinfo) {
        // code block to be executed
          totalRat = 0
          totalComments = playerinfo[player].verifiedcomments.length
          for (k in playerinfo[player].verifiedcomments){
              totalRat += parseFloat(playerinfo[player].verifiedcomments[k].rating)
          }
          obj = {
            'fullname' : playerinfo[player].fullname,
            'avgRat' : (totalRat/totalComments).toFixed(2),
            'ratingsgained' : totalRat,
            'totalRatings' : totalComments
          }
          emptyArr.push(obj)
        }
        for(l in emptyArr){
          if( isNaN(emptyArr[l].avgRat) ){
            emptyArr[l].avgRat = 0
          }
        }
        emptyArr.sort((a,b) => (a.avgRat < b.avgRat ? 1 : ((b.avgRat < a.avgRat) ? -1 : 0)))
        console.log(emptyArr.length)
        res.render('rankings', {arr: emptyArr,position:""})

  })
})

/////////////////////////////////////////


app.post('/positionrankings', function(req, res){
  playerModel.find({}, function (err, playerinfo) {

    console.log(req.body.position)

    emptyArr = []

    for (player in playerinfo) {
    // code block to be executed
      totalRat = 0
      totalComments = playerinfo[player].verifiedcomments.length
      for (k in playerinfo[player].verifiedcomments){
          totalRat += parseFloat(playerinfo[player].verifiedcomments[k].rating)
      }
      obj = {
        'fullname' : playerinfo[player].fullname,
        'avgRat' : (totalRat/totalComments).toFixed(2),
        'ratingsgained' : totalRat,
        'totalRatings' : totalComments,
        'position': playerinfo[player].position
      }
      emptyArr.push(obj)
    }
    for(l in emptyArr){
      if( isNaN(emptyArr[l].avgRat) ){
        emptyArr[l].avgRat = 0
      }
    }
    emptyArr.sort((a,b) => (a.avgRat < b.avgRat ? 1 : ((b.avgRat < a.avgRat) ? -1 : 0)))
    console.log(emptyArr.length)
    res.render('rankings', {arr: emptyArr,position:req.body.position})
9

  })
})

/////////////////////////////////////////


app.post('/sortedplayers', async function(req,res){
  var imageurl;
  userModel.find({
    username:req.session.username
  },
  function(err,user){
      imageurl = user[0].imagelink
      playerModel.find({}, function (err, playerinfo) { // tüm oyuncuları bulup listeyi aktarır

        var sortedPlayers = playerinfo.sort((a,b) => (a.fullname > b.fullname ? 1 : ((b.fullname > a.fullname) ? -1 : 0)))

        console.log(sortedPlayers)

        res.render('mainpage',{
          arr:sortedPlayers,
          searchtext: "",
          position:"",
          link:imageurl
        })
    });
  }
  )


})
app.get('/verify', function(req, res) {
  userModel.find({isVerified: "no"}, function (err, users) {
    res.render('verification', {users:users})
  })

})


app.post('/verify', function(req, res) {
  userModel.findOneAndUpdate({email: req.body.email}, {isVerified: "yes"}, (err, userSample) => {
    if(err){
      res.send(err);
    }else{
      res.redirect("/verify")
    }
  })
})

app.post('/playerprofile/:playername', async function(req, res) {
  //find the player by player name from the database
  //console.log(req.params)
  //console.log(req.session);

  var faved = false;
  if(req.session.username){
    var theFavorites = []

     await userModel.findOne({
       username: req.session.username
     }).then(
       (user)=>{
       theFavorites = user.favorites
     });

     for(let z=0;z<theFavorites.length;z++){
       theFavorites.forEach((item, index, object) => {
         if(theFavorites[z]['name'] == decodeURI(req.url.split("/").pop().slice(1))){
           faved = true
         }
       });
     }
   }

  console.log(req.session);


  if(!req.session.username){
    res.redirect('/')
    return
  }

  var name = req.params['playername'].substring(1)
  var query = {fullname: name}

  var theFollowed;

  await userModel.findOne({
    username: req.session.username
  }).then(
    (user)=>{
    console.log("userinfo" + user)
    theFollowed = user.followings
  });

  playerModel.find(query, function (err, playerinfo) {
    var result = playerinfo[0].comments.findIndex(({ commenter }) => commenter === req.session.username)
    console.log(result)
    var sortedComments = playerinfo[0].comments.sort((a,b) => (a.commenter > b.commenter) ? 1 : ((b.commenter > a.commenter) ? -1 : 0))

    console.log(sortedComments[0])

    var size = playerinfo[0].verifiedcomments.length
    var sum =0;
    var avg;
    var theFollowedComments = [];

    for(let i=0;i<size;i++){
      sum+= Number(playerinfo[0].verifiedcomments[i]['rating'])
    }
    for(let z=0;z<size;z++){
      theFollowed.forEach((item, index, object) => {
        if(playerinfo[0].verifiedcomments[z]['commenter'] == item["name"]){
          theFollowedComments.push(playerinfo[0].verifiedcomments[z])
        }
      });
    }
    if(size!=0){
      avg = (sum/size).toFixed(1)
    }
    else{
      avg = -1
    }
    console.log("playerinfo[0].verifiedcomments " + playerinfo[0].verifiedcomments[0]);
    if(result==-1){                 // daha önce yorumu yoksa
      res.render('playerprofile',{
        pName: playerinfo[0].fullname,
        pAge: playerinfo[0].age,
        standardcomments : sortedComments,
        verifiedcomments : theFollowedComments,
        commenttype: "add",
        average: avg,
        favored: faved
      })
    }
    else{                           // daha önce yorumu varsa
      res.render('playerprofile',{
        pName: playerinfo[0].fullname,
        pAge: playerinfo[0].age,
        standardcomments : sortedComments,
        verifiedcomments : theFollowedComments,
        commenttype: "edit",
        average: avg,
        favored: faved
      })
    }
  });
});

app.post('/enterlink',async function(req,res){ //

  console.log(req.body.link)
  await userModel.updateOne({
    username: req.session.username,
  },
  {
    $set:{
      imagelink: req.body.link,
    }
  },
  );

  userModel.find({username: req.session.username}, function (err, userinfo) {
    res.render('userprofile',{
      username: req.session.username,
      email: req.session.email,
      password: req.session.password,
      commentarray: userinfo[0].comments,
      userimage: userinfo[0].imagelink,
      favoritesArray: userinfo[0].favorites
    })
  });

})
app.post('/generatePassword', async function(req,res){

  var length = 12,
      charset =
"@#$&*0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$&*0123456789abcdefghijklmnopqrstuvwxyz";
      var generatedPassword = "";
  for (var i = 0, n = charset.length; i < length; ++i) {
      generatedPassword += charset.charAt(Math.floor(Math.random() * n));
  }
  console.log(generatedPassword)

  res.render('register',{
    generatedPassword: generatedPassword


  })

}
);

app.post('/followUser', async function(req,res){
  await userModel.findOneAndUpdate({
    username: req.session.username
  },
  {
    $addToSet:{
      followings: {
        name: req.body.name,

      }
    }

  }

  );
  res.redirect("/verifieduserprofile/:"+req.body.name)


});

app.post('/deletefollowing', async function(req,res){


  await userModel.findOneAndUpdate({
    username: req.session.username
  },{
    $pull:{
      followings: {
        name: req.body.name
      }

  }});
  res.redirect("/verifieduserprofile/:"+req.body.name)
});


app.post('/favorite', async function(req,res){
  if(!req.session.username){
    return
  }
 var theFavorites = []

  await userModel.findOne({
    username: req.session.username
  }).then(
    (user)=>{
    theFavorites = user.favorites
  });

  var faved = false;

  for(let z=0;z<theFavorites.length;z++){
    theFavorites.forEach((item, index, object) => {
      if(theFavorites[z]['name'] == decodeURI(req.body["name"].slice(1))){
        faved = true
      }
    });
  }

  console.log(faved);

  if(faved == false){
    await userModel.findOneAndUpdate({
      username: req.session.username
    },{
      $addToSet:{
        favorites: {
          name: decodeURI(req.body["name"].slice(1))
        }

    }});
  }else{
    console.log("already here");
    await userModel.findOneAndUpdate({
      username: req.session.username
    },{
      $pull:{
        favorites: {
          name: decodeURI(req.body["name"].slice(1))
        }

    }});
  }


});

app.listen(process.env.PORT || 3001);
