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

// find all from the model
userModel.find().then(
    (things) => {
      res.status(200).json(things);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );

  //find by parameter for 1

  userModel.findOne({
    name: req.params.name
  }).then(
    (thing) => {
      res.status(200).json(thing);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
