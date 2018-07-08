const mongoose = require('mongoose');
const db = mongoose.connection;

module.exports = function () {

  mongoose.connect('mongodb://localhost:27017/clients', {useNewUrlParser: true});

  db.on("error", console.error.bind(console, "connection error"));
  db.once("open", function (callback) {
    console.log("MongoDB Connected");
  });

};
