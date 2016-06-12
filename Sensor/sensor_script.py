import requests

if __name__ == '__main__':

	var = 1
	while var == 1 :  # This constructs an infinite loop
		sensorId = raw_input("Enter a Sensor Id (1 for Sensor 1)  :")
		print "You entered Sensor ID: ", sensorId
		triggerId = raw_input("Enter a trigger (1 for trigger 1)  :")
		print "You entered trigger ID: ", triggerId
		# curl command
	   	
		headers = {'content-type': 'application/json', 'Accept-Charset': 'UTF-8'}		
		
		#payload = json.loads("{\"sensorID\": \""+sensorId+"\", \"triggerID\": \""+triggerId+"\", \"message\": \"earthquake\"}")
		payload = "{\"sensorID\": \""+sensorId+"\", \"triggerID\": \""+triggerId+"\", \"message\": \"earthquake\"}"
		
		# https://smart-notification-server.herokuapp.com/sensor
		r = requests.post("https://smart-notification-server.herokuapp.com/sensor", data=payload, headers=headers)

	print "Good bye!"
	
