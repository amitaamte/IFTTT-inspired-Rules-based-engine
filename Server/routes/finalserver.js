    module.exports = function (app) {

        var _ = require('underscore');
        var bodyParser = require('body-parser');
        app.use(bodyParser.json());
        var o2x = require('object-to-xml');
        var mongoose = require('mongoose');

        //GCM integration
        var gcm = require('node-gcm');
        var sender = new gcm.Sender('AIzaSyDdMT2Y1-OZFLOTLI1haEPoudYSuz38KRM');

        //Twilio Integration
        var client = require('twilio')('ACd54cb6f1b8a8bf9d23fe511d24d3459e', '472205f35904bda6943ed88a1343e2b1');
        var twilio = require('twilio');

        //Global sensor and trigger IDs
        var sensorCurrent;
        var triggerCurrent;

        //Define DB Schemas
        //User Schema
        var Schema = mongoose.Schema;

        var userSchema = new Schema({

            name: String
            , token: String
            , num: String
            , num1: String
            , num2: String
            , sensorID: String
            , wifi: Boolean

        });

        var User = mongoose.model('User', userSchema);

        //Trigger Schema    
        var triggerSchema = mongoose.Schema({

            sensorID: String
            , triggerID: String
            , message: String

        });

        var Trigger = mongoose.model('Trigger', triggerSchema);

        //API ROOT
        app.get('/', function (req, res) {
            res.send('API Root');
        });

        // POST: '/callfirst'
        app.post('/callfirst1', twilio.webhook({
            validate: false
        }), function (request, response) {
            console.log(request.body);
            var twiml = new twilio.TwimlResponse();
            twiml.gather({
                action: "/ack"
                , numDigits: "1"
                , method: "POST"
            }, function (node) {
                node.say("Hi, you have been added to the smart notification service. You have been subscribed to sensor one. Press one to acknowledge.", {
                    voice: "alice"
                    , language: "en-GB"
                    , loop: 3
                });
            });
            response.send(twiml);
        });

        app.post('/callfirst2', twilio.webhook({
            validate: false
        }), function (request, response) {
            console.log(request.body);
            var twiml = new twilio.TwimlResponse();
            twiml.gather({
                action: "/ack"
                , numDigits: "1"
                , method: "POST"
            }, function (node) {
                node.say("Hi, you have been added to the smart notification service. You have been subscribed to sensor two. Press one to acknowledge.", {
                    voice: "alice"
                    , language: "en-GB"
                    , loop: 3
                });
            });
            response.send(twiml);
        });

        //Notification Alert Call
        // POST: '/call'
        app.post('/call', twilio.webhook({
            validate: false
        }), function (request, response) {

            Trigger.findOne({
                sensorID: sensorCurrent
                , triggerID: triggerCurrent
            }, function (err, trigger) {
                if (err) console.log(err);

                console.log(trigger);
                var twiml = new twilio.TwimlResponse();


                twiml.gather({
                    action: "/ack"
                    , numDigits: "1"
                    , method: "POST"
                }, function (node) {
                    node.say("Notification from sensor " + sensorCurrent + ". " + trigger.message + ".", {
                        voice: "alice"
                        , language: "en-GB"
                        , loop: 3
                    });

                });
                response.send(twiml);
            });
        });

//        app.post('/call2', twilio.webhook({
//            validate: false
//        }), function (request, response) {
//            console.log(request.body);
//            var twiml = new twilio.TwimlResponse();
//            twiml.gather({
//                action: "/ack"
//                , numDigits: "1"
//                , method: "POST"
//            }, function (node) {
//                node.say("You are receiving this call to alert you about a notification from sensor two. Press one to acknowledge this alert. Press two to connect with your emergency contacts.", {
//                    voice: "alice"
//                    , language: "en-GB"
//                    , loop: 3
//                });
//            });
//            response.send(twiml);
//        });

        //Ack calls
        //url/ack
        app.post('/ack', twilio.webhook({
            validate: false
        }), function (req, res) {

            var twiml = new twilio.TwimlResponse();
            twiml
                .say('Thanks for the acknowledgement . Goodbye', {
                    voice: 'alice'
                    , language: 'en-GB'
                })
                .hangup();
            console.log('received ACK');
            res.send(twiml.toString());
        });

        //        //url/ack1
        //        app.post('/ack1', twilio.webhook({
        //            validate: false
        //        }), function (req, res) {
        //            var selectedOption = request.body.Digits;
        //            var optionActions = {
        //                "1": completeAck
        //               ,"2": connectEmergency
        //            };
        //
        //            if (optionActions[selectedOption]) {
        //                var twiml = new twilio.TwimlResponse();
        //                optionActions[selectedOption](twiml);
        //                response.send(twiml);
        //            }
        //            response.send(invalid());
        //        });
        
        //FIRST TIME LOGIN
        //url/firstlogin
        app.post('/firstlogin', function (req, res) {
            var body = _.pick(req.body, 'name', 'token', 'num', 'num1', 'num2', 'sensorID');
            console.log(body.name);

            //Add user to DB
            var user = new User({
                name: body.name
                , token: body.token
                , num: body.num
                , num1: body.num1
                , num2: body.num2
                , sensorID: body.sensorID
                , wifi: true
            });

            user.save(function (err) {
                if (err) throw err;

                console.log('New user successfully saved');
            });


            var message = new gcm.Message();
            message.addData('message', 'Hi! ' + body.name + ' ,you have been registered to our service.');
            message.addData('msgcnt', '1');
            var registrationTokens = [];
            registrationTokens.push(body.token);

            sender.sendNoRetry(message, {
                registrationTokens: registrationTokens
            }, function (err, response) {
                if (err) console.error(err);
                else console.log(response);
            });
            //SEND SMS to USER
            client.sendMessage({

                to: body.num, // Any number Twilio can deliver to
                from: '+19492200716', // A number you bought from Twilio and can use for outbound communication
                body: 'Hi, ' + body.name + ' you have been connected to our service and subscribed to sensor: ' + body.sensorID // body of the SMS message

            }, function (err, responseData) { //this function is executed when a response is received from Twilio

                if (!err) { // "err" is an error received during the request, if any

                    // "responseData" is a JavaScript object containing data received from Twilio.
                    // A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
                    // http://www.twilio.com/docs/api/rest/sending-sms#example-1

                    console.log(responseData.from);
                    console.log(responseData.body);

                }
            });

            //Call user with subscription information
            client.makeCall({

                to: body.num, // Any number Twilio can call
                from: '+19492200716', // A number you bought from Twilio and can use for outbound communication
                url: 'https://smart-notification-server.herokuapp.com/callfirst' + body.sensorID // A URL that produces an XML document (TwiML) which contains instructions for the call

            }, function (err, responseData) {

                //executed when the call has been initiated.
                //console.log(responseData.from); // outputs "+14506667788"

            });

            //SEND SMS to NUM1
            client.sendMessage({

                to: body.num1, // Any number Twilio can deliver to
                from: '+19492200716', // A number you bought from Twilio and can use for outbound communication
                body: 'Hi, ' + body.name + ' has added you to our service!!' // body of the SMS message

            }, function (err, responseData) { //this function is executed when a response is received from Twilio

                if (!err) { // "err" is an error received during the request, if any

                    // "responseData" is a JavaScript object containing data received from Twilio.
                    // A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
                    // http://www.twilio.com/docs/api/rest/sending-sms#example-1

                    console.log(responseData.from); // outputs "+14506667788"
                    console.log(responseData.body); // outputs "word to your mother."

                }
            });

            //SEND SMS to NUM2
            client.sendMessage({

                to: body.num2, // Any number Twilio can deliver to
                from: '+19492200716', // A number you bought from Twilio and can use for outbound communication
                body: 'Hi, ' + body.name + ' has added you to our service!!' // body of the SMS message

            }, function (err, responseData) { //this function is executed when a response is received from Twilio

                if (!err) { // "err" is an error received during the request, if any

                    // "responseData" is a JavaScript object containing data received from Twilio.
                    // A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
                    // http://www.twilio.com/docs/api/rest/sending-sms#example-1

                    console.log(responseData.from); // outputs "+14506667788"
                    console.log(responseData.body); // outputs "word to your mother."

                }
            });

            res.json(body);
        });

        //WIFI- To track wifi status for a user
        //url/sms
        app.post('/sms', function (req, res) {
            var body = _.pick(req.body, 'name', 'token', 'num', 'wifi');
            console.log(body.name);
            console.log(body.wifi);
            wifi = body.wifi;
            if (body.wifi == false) {
                //Update wifi flag in DB
                User.findOneAndUpdate({
                    name: body.name
                }, {
                    wifi: false
                }, function (err, user) {
                    if (err) throw err;
                    console.log(user);
                });

                //SEND SMS to USER
                client.sendMessage({
                    to: body.num, // Any number Twilio can deliver to
                    from: '+19492200716', // A number you bought from Twilio and can use for outbound communication
                    body: 'Hi, ' + body.name + ', Low WIFI, you will now receive sms notifications.' // body of the SMS message

                }, function (err, responseData) { //this function is executed when a response is received from Twilio

                    if (!err) { // "err" is an error received during the request, if any

                        // "responseData" is a JavaScript object containing data received from Twilio.
                        // A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
                        // http://www.twilio.com/docs/api/rest/sending-sms#example-1

                        console.log(responseData.from); // outputs "+14506667788"
                        console.log(responseData.body); // outputs "word to your mother."

                    }
                });
            }

            res.json(body);
        });

        //Registering a sensor to the service
        //Sensor can make post request to this url to add messages corresponding to triggerIDs
        app.post('/sensorreg', function (req, res) {
            var body = _.pick(req.body, 'sensorID', 'triggerID', 'message');
            console.log(body.sensorID);
            console.log(body.triggerID);
            console.log(body.message);

            //Add trigger to DB
            var trigger = new Trigger({
                sensorID: body.sensorID
                , triggerID: body.triggerID
                , message: body.message
            });

            trigger.save(function (err) {
                if (err) throw err;
                console.log('Trigger from sensor: ' + body.sensorID + ' saved, with trigger id: ' + body.triggerID + ' and message: ' + body.message + ' .');
            });
            res.json(body);
        });

        //SENSOR POSTS
        //url/sensor
        app.post('/sensor', function (req, res) {
            var body = _.pick(req.body, 'sensorID', 'triggerID');
            sensorCurrent = body.sensorID;
            triggerCurrent = body.triggerID;
            console.log(body.sensorID);
            console.log(body.triggerID);

            console.log("Global1: " + sensorCurrent);
            console.log("Global1: " + triggerCurrent);

            Trigger.findOne({
                sensorID: body.sensorID
                , triggerID: body.triggerID
            }, function (err, trigger) {
                if (err) console.log(err);
                console.log(trigger);
                console.log(trigger.message);

                User.find({
                        sensorID: body.sensorID
                    }
                    , function (err, users) {
                        //user will return an array with all users that are registered to the sensor
                        if (err) console.log(err);
                        console.log(users);
                        for (var i = 0; i < users.length; i++) {
                            console.log(users[i].name);
                            console.log(users[i].num);
                            if (users[i].wifi == false) {
                                client.sendMessage({
                                    to: users[i].num, // Any number Twilio can deliver to
                                    from: '+19492200716', // A number you bought from Twilio and can use for outbound communication
                                    body: trigger.message // body of the SMS message

                                }, function (err, responseData) { //this function is executed when a response is received from Twilio

                                    if (!err) {

                                        console.log(responseData.from); // outputs "+14506667788"
                                        console.log(responseData.body); // outputs "word to your mother."

                                    }
                                });

                                //Call user with trigger alert
                                client.makeCall({

                                    to: users[i].num, // Any number Twilio can call
                                    from: '+19492200716', // A number you bought from Twilio and can use for outbound communication
                                    url: 'https://smart-notification-server.herokuapp.com/call' // A URL that produces an XML document (TwiML) which contains instructions for the call

                                }, function (err, responseData) {

                                    //executed when the call has been initiated.
                                    //console.log(responseData.from); // outputs "+14506667788"

                                });
                            } else {
                                var message = new gcm.Message();
                                message.addData('message', trigger.message);
                                message.addData('msgcnt', '1');
                                var registrationTokens = [];
                                registrationTokens.push(users[i].token);

                                sender.sendNoRetry(message, {
                                    registrationTokens: registrationTokens
                                }, function (err, response) {
                                    if (err) console.error(err);
                                    else console.log(response);
                                });

                            }
                            //Send SMS to emergency contacts
                        }

                    });

            });
            console.log("Global: " + sensorCurrent);
            console.log("Global: " + triggerCurrent);
            res.json(body);
        });

    }