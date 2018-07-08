var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ProviderSchema = new Schema({
  name: String
});

var Provider = mongoose.model("Provider", ProviderSchema);
module.exports = Provider;
