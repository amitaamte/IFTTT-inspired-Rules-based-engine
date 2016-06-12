//new server
var express = require('express');
var mongodb = require('mongodb');
var mongoose = require('mongoose');
var app = express();
//var User = require('./models/user')(app);
var routes = require('./routes/finalserver')(app);
var PORT = process.env.PORT || 3000;
var uristring = process.env.MONGODB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/nodeDB'

allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    if ('OPTIONS' === req.method) {
        res.send(200);
    } else {
        next();
    }
};

app.use(allowCrossDomain);


//Connect to mongoDB
mongoose.connect(uristring, function (err, res) {
    if (err) {
        console.log('Error connecting to : ' + uristring + '. ' + err);
    } else {
        console.log('Successfully connected to: ' + uristring);
        //Express Connection
        app.listen(PORT, function () {
            console.log('Express listening on port:: ' + PORT);

        });
    }
});