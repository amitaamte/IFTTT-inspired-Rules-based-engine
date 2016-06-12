var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var triggerSchema = new Schema({
   sensorID: String,
    triggerID: String,
    message: String,
    num1: String,
    num2: String    
    
});


var User = mongoose.model('User',userSchema);

module.exports = User;