# IFTTT-inspired-Rules-based-engine

Developed a rules based engine in Node.js that can read data from multiple sensors (multiple triggers) and can be easily integrated with any system.
Performs desired action (If This (trigger) Then That (action)) and ensures alerts are sent (when sensor is triggered) even during poor network connectivity. 
Use of Google Cloud Messaging service (GCM) and Twilio (multiple actions) for push notifications.

The client folder has the TriggerAction android app which allows user to register for desired sensors and tracks the device's Wifi strength.
The Server consists of the rules based engine written in Node.js.
The Sensor folder consists of the sensor script in python and the accelerometer android app that detects shake motion used as an 
earthquake sensor.

Upgraded from existing IFTTT recipes which allow only 1 trigger and 1 action and provide no network considerations.
