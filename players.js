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
const playerSchema = new Schema({
  fullname: String,
  age: Number,
  comments : { type : Array , "default" : [] }

});

const playerModel = mongoose.model("player", playerSchema);

const playerInstance = new playerModel(
{
  fullname: 'Arda Turan',
  age : 28
});

playerInstance.save((err) => {
  if (err) {
    console.log(err);
  }else{
    console.log('SUCCESS SAVE');
  }
});
