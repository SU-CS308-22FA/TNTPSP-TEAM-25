var express = require('express')
var cookieParser = require('cookie-parser')
var cors = require('cors')

var app = express()

const corsOptions = {
  optionsSuccessStatus: 200,
  credentials: true,
}

//MONGOOSE

const mongoose = require("mongoose");

const mongoDB = "mongodb://localhost:27017";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const Schema = mongoose.Schema;
const userSchema = new Schema({
  username: String,
  password: String,
  email: String
});


//---------//


app.use(cors(corsOptions))

app.get('/l', function (req, res) {
  console.log("taken")
  res.send('hi')
})
app.get('/login', function (req, res) {
  console.log(req.query.email);
  console.log(req.query.password);
  res.send(req.query)
})

app.get('/register', function (req, res) {
  console.log(req.query.username);
  console.log(req.query.email);
  console.log(req.query.password);


  const userModel = mongoose.model("userModel", userSchema);
  const userInstance = new userModel(
    {
      name: req.query.username,
      password : req.query.password,
      email: req.query.email
    }
  );

  userInstance.save((err) => {
    if (err){
      res.redirect('/error')
    }else{
      res.send("registered")
    }
  })


})

app.get('/error', function(req, res){
  res.send("error")
})
app.listen(3001)
