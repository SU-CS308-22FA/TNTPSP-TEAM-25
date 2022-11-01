const mongoose = require("mongoose");

const mongoDB = "mongodb://localhost:27017";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const Schema = mongoose.Schema;

//#id #username #sifre

const userSchema = new Schema({
  id: Number,
  username: String,
  password: String,
  email: String
});

const userModel = mongoose.model("userModel", userSchema);

const userInstance = new userModel(
  {
    id : 1212332,
    name: "deneasdame123",
    password : "asdaasddeneme123",
    email: "denemasdaasdase@mail.com"
  }
);

userInstance.save((err) => {
  if (err) return handleError(err);
  // saved!
});
