var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ClientSchema = new Schema({
  name: String,
  email: String,
  phone: String,
  providers: [ String ]
});

var Client = mongoose.model("Client", ClientSchema);
module.exports = Client;
