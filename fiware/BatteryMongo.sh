curl -iX POST \
  'http://192.168.178.75:5000/api/v1/databases/yourDatabaseName/collections/yourCollectionName/documents' \
  -H 'Content-Type: application/json' \
  -d '{
  "id": "urn:ngsi-ld:Device:Battery004",
  "type": "BatteryFunky",
  "category": {
    "type": "Text",
    "value": "battery"
  },
  "Geppett": {
    "type": "whatever",
    "value": "miao"
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
  "geppetto": {
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
