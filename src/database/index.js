const mongoose = require("mongoose");

mongoose.connect('mongodb://localhost/restdb', { useNewUrlParser: true });

mongoose.Promise = global.Promise;

module.exports = mongoose;