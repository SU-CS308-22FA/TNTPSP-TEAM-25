
const mongoose = require("mongoose");
var express = require('express')
var cookieParser = require('cookie-parser')

///MONGO connect

const mongoDB = "mongodb://localhost:27017";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const Schema = mongoose.Schema;
const userSchema = new Schema({
  username: String,
  password: String,
  type: String
});
const userModel = mongoose.model("userModel", userSchema);

//////////////

var app = express()
app.use(cookieParser())

app.get('/cookies', function (req, res) {

  console.log('Cookies: ', req.cookies)
  // Cookies that have been signed
  console.log('Signed Cookies: ', req.signedCookies)
  res.cookie('name', 'express').send('cookie set'); //Sets name = express

})


app.get('/',(req,res) => {
    session=req.session;
    if(session.userid){
        res.send("Welcome User <a href=\'/logout'>click to logout</a>");
    }else
    res.sendFile('views/index.html',{root:__dirname})
});


app.listen(3000)
