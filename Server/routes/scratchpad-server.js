    module.exports = function (app) {

        var _ = require('underscore');
        var bodyParser = require('body-parser');
        app.use(bodyParser.json());
        
        //GCM integration
        var GCM = require('gcm').GCM;
        var apiKey = 'AIzaSyDdMT2Y1-OZFLOTLI1haEPoudYSuz38KRM';

        //Twilio Integration
        var client = require('twilio')('ACd54cb6f1b8a8bf9d23fe511d24d3459e', '472205f35904bda6943ed88a1343e2b1');

        //API ROOT
        app.get('/', function (req, res) {
            res.send('Todo API Root');
        });

        //GET request to fetch all data
        //GET /alldata
        app.get('/alldata', function (req, res) {
            res.json(testdata);
        });


        //GET /data/:id
        app.get('/data/:id', function (req, res) {
            var Id = parseInt(req.params.id);
            var matchdata = _.findWhere(testdata, {
                id: Id
            });

            if (!matchdata) {
                res.status(404).send();
            }
            res.json(matchdata);


        });

        //POST request to pass user data to app in JSON
        // POST /user
        //{'user': String, 'token': String, 'num': String}
        app.post('/user', function (req, res) {
            var body = _.pick(req.body, 'user', 'token', 'num');
            console.log(body.user);
            console.log(body.token);
            console.log(body.num);

            var gcm = new GCM(apiKey);
            var regid = body.token;
            var message = {
                registration_id: regid, // required
                collapse_key: 'Collapse key'
                , 'data.key1': 'value1'
                , 'data.key2': 'value2'
            };

            gcm.send(message, function (err, messageId) {
                if (err) {
                    console.log("Something has gone wrong!");
                } else {
                    console.log("Sent with message ID: ", messageId);
                }
            });
            //Send Twilio message on POST
            client.sendMessage({

                to: body.num, // Any number Twilio can deliver to
                from: '+19492200716', // A number you bought from Twilio and can use for outbound communication
                body:  'Hi, '+body.user+' you have been connected to our service!!' // body of the SMS message

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

        //This will start Twilio SMS service, wifi signal low

        app.post('/sms', function (req, res) {
            var body = _.pick(req.body, 'wifi');

            //Send Twilio message on POST
            console.log(req);
            console.log(req.body);
            console.log(body);
            if (body.wifi == false) {
                client.sendMessage({

                    to: '+19493000798', // Any number Twilio can deliver to
                    from: '+19492200716', // A number you bought from Twilio and can use for outbound communication
                    body: 'Hello from node!' // body of the SMS message

                }, function (err, responseData) { //this function is executed when a response is received from Twilio

                    if (!err) { // "err" is an error received during the request, if any

                        // "responseData" is a JavaScript object containing data received from Twilio.
                        // A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
                        // http://www.twilio.com/docs/api/rest/sending-sms#example-1

                        console.log(responseData.from);
                        console.log(responseData.body);

                    }
                });

                client.sendMessage({

                    to: '+19492937594', // Any number Twilio can deliver to
                    from: '+19492200716', // A number you bought from Twilio and can use for outbound communication
                    body: 'Hello from node!' // body of the SMS message

                }, function (err, responseData) { //this function is executed when a response is received from Twilio

                    if (!err) { // "err" is an error received during the request, if any

                        // "responseData" is a JavaScript object containing data received from Twilio.
                        // A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
                        // http://www.twilio.com/docs/api/rest/sending-sms#example-1

                        console.log(responseData.from);
                        console.log(responseData.body);

                    }
                });
            }


            res.json(body);

        });


        //DELETE /data/:id
        app.delete('/data/:id', function (req, res) {
            var Id = parseInt(req.params.id);
            var matchdata = _.findWhere(data, {
                id: Id
            });

            if (!matchdata) {
                res.status(404).send();
            }
            data = _.without(data, matchdata);
            res.json(matchdata);


        });


        //PUT (UPDATE) /data/:id
        app.put('/data/:id', function (req, res) {
            var Id = parseInt(req.params.id);
            var matchdata = _.findWhere(data, {
                id: Id
            });
            var body = _.pick(req.body, 'description', 'completed');
            var validAttribute = {};

            if (!matchdata) {
                return res.status(404).send();
            }

            if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
                validAttribute.completed = body.completed;
            } else if (body.hasOwnProperty('completed')) {
                return res.status(400).send();
            }

            if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
                validAttribute.description = body.description;
            } else if (body.hasOwnProperty('description')) {
                return res.status(400).send();
            }

            _.extend(matchdata, validAttribute);
            res.json(matchdata);
        });

    }