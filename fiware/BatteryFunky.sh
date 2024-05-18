curl -iX POST \
  'http://localhost:1026/v2/entities' \
  -H 'Content-Type: application/json' \
  -d '{
  "id": "urn:ngsi-ld:Device:Battery004",
  "type": "BatteryFunky",
  "category": {
    "type": "Text",
    "value": "battery"
  },
  "batteryLevel": {
    "type": "Number",
    "value": 100
  },
  "chargingStatus": {
    "type": "Text",
    "value": "discharging"
  },
  "location": {
    "type": "geo:json",
    "value": {
      "type": "Point",
      "coordinates": [-3.7038, 40.4168]
    }
  },
   "houseId": {
      "type": "String",
      "value": "house1"
    },
    "geppetto" : {
		"type": "String",
		"value": "miao"
    },
    "fishName": {
    "type": "List",
    "value": [
      "Marcello",
      "Ermenegisto"
    ]
  }

}'
