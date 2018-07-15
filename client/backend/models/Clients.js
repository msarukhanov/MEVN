var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ClientSchema = new Schema({
  name: String,
  email: String,
  phone: String,
  providers: [ { type: Schema.Types.ObjectId, ref: 'Provider' } ]
});

var ProviderSchema = new Schema({
  name: String
});

var Client = mongoose.model("Client", ClientSchema);
module.exports = Client;
