function loop() {
  try {
    Shelly.call("HTTP.GET", {"url": "http://192.168.178.91/status", "timeout": 5}, function (response) {
        if(response === undefined){
          return;
        }
        
        if (response.code === 200) {
            try {
                let jsonData = JSON.parse(response.body);
                //print("Decoded JSON data:");
                //print(jsonData);
				
				let status = jsonData["emeters"][0];
				
				var statusJson = {
					type: "SmartPlug",
					decoder: "shellyV1",
					serial: jsonData.mac,
					power: status.power,
					voltage: status.voltage,
					current: 0,
					energy: status.total,
					temperature: 0
				};
				
				let pay = JSON.stringify(statusJson);
				
				Shelly.call("HTTP.POST", {"url": "http://ds.seisho.us/reading/V1", "body": pay, "timeout": 5});

	  
            } catch (error) {
                print("Failed to parse JSON:", error.message);
            }
        } else {
            print("Failed to fetch data from URL, response code:", response.code);
        }
    });
    }catch (error){
      return;
    }
};

loop();

Timer.set(5 * 60 * 1000, true, loop); // 5 minutes
