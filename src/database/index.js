const mongoose = require("mongoose");

mongoose.connect('mongodb://localhost/restdb');
mongoose.Promise = global.Promise;

module.exports = mongoose;